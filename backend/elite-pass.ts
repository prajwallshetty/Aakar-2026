"use server";

import { Prisma, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { db } from ".";
import { isAdmin } from "./admin";

const ELITE_PASS_PRICE = 999;

type ElitePassOrderInput = {
  name: string;
  usn: string;
  email: string;
  phone: string;
  college: string;
  department?: string;
  year: number;
  transactionId: string;
  paymentScreenshotUrl?: string;
};

type ServiceResponse<T> = {
  data: T | null;
  error: { [key: string]: string } | string | null;
};

let fallbackPrismaClient: PrismaClient | null = null;
let ensuredElitePassTable = false;

function getFallbackPrismaClient() {
  if (!fallbackPrismaClient) {
    fallbackPrismaClient = new PrismaClient();
  }
  return fallbackPrismaClient;
}

function getElitePassOrderDelegate(client: any) {
  // Some environments can expose delegates with different casing or stale globals.
  const delegate = client?.elitePassOrder ?? client?.ElitePassOrder;
  if (delegate) return delegate;

  const fallbackClient = getFallbackPrismaClient() as any;
  return fallbackClient?.elitePassOrder ?? fallbackClient?.ElitePassOrder ?? null;
}

async function ensureElitePassOrderTable(client: any) {
  if (ensuredElitePassTable) return;

  await client.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ElitePassOrder" (
      "id" SERIAL PRIMARY KEY,
      "uuid" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "usn" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "college" TEXT NOT NULL,
      "department" TEXT,
      "year" INTEGER NOT NULL DEFAULT 1,
      "transactionId" TEXT NOT NULL,
      "amount" INTEGER NOT NULL DEFAULT 0,
      "paymentScreenshotUrl" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "ElitePassOrder_usn_key" ON "ElitePassOrder" ("usn");`,
  );
  await client.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "ElitePassOrder_email_key" ON "ElitePassOrder" ("email");`,
  );
  await client.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "ElitePassOrder_transactionId_key" ON "ElitePassOrder" ("transactionId");`,
  );

  ensuredElitePassTable = true;
}

async function createElitePassOrderRecord(client: any, data: {
  name: string;
  usn: string;
  email: string;
  phone: string;
  college: string;
  department: string | null;
  year: number;
  transactionId: string;
  amount: number;
  paymentScreenshotUrl: string | null;
}) {
  const now = new Date();

  const elitePassOrder = getElitePassOrderDelegate(client);

  if (elitePassOrder) {
    return elitePassOrder.create({ data });
  }

  await ensureElitePassOrderTable(client);

  const inserted = await client.$queryRaw<Array<any>>`
    INSERT INTO "ElitePassOrder"
      ("uuid", "name", "usn", "email", "phone", "college", "department", "year", "transactionId", "amount", "paymentScreenshotUrl", "createdAt", "updatedAt")
    VALUES
      (${randomUUID()}, ${data.name}, ${data.usn}, ${data.email}, ${data.phone}, ${data.college}, ${data.department}, ${data.year}, ${data.transactionId}, ${data.amount}, ${data.paymentScreenshotUrl}, ${now}, ${now})
    RETURNING *
  `;

  return inserted[0] ?? null;
}

async function listElitePassOrders(client: any) {
  const elitePassOrder = getElitePassOrderDelegate(client);

  if (elitePassOrder) {
    return elitePassOrder.findMany({ orderBy: { createdAt: "desc" } });
  }

  await ensureElitePassOrderTable(client);

  return client.$queryRaw<Array<any>>`
    SELECT *
    FROM "ElitePassOrder"
    ORDER BY "createdAt" DESC
  `;
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

export async function validateElitePassOrderData(data: ElitePassOrderInput): Promise<{ [key: string]: string } | null> {
  const errors: { [key: string]: string } = {};

  if (!data.name || data.name.trim().length < 2) errors.name = "Name is required";
  if (!data.usn || data.usn.trim().length < 4) errors.usn = "USN is required";
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Valid email is required";

  const normalizedPhone = normalizePhone(data.phone || "");
  if (!normalizedPhone || !/^\d{10}$/.test(normalizedPhone)) errors.phone = "Valid 10-digit phone number is required";

  if (!data.college || data.college.trim().length < 2) errors.college = "College name is required";
  if (!data.department || data.department.trim().length < 2) errors.department = "Department is required";
  if (!data.year || Number.isNaN(Number(data.year)) || data.year < 1 || data.year > 8) errors.year = "Valid year of study is required";
  if (!data.transactionId || data.transactionId.trim().length < 4) errors.transactionId = "Transaction ID is required";

  return Object.keys(errors).length > 0 ? errors : null;
}

export async function createElitePassOrder(data: ElitePassOrderInput): Promise<ServiceResponse<any>> {
  try {
    const passDb = db as any;

    const validationErrors = await validateElitePassOrderData(data);
    if (validationErrors) {
      return { data: null, error: validationErrors };
    }

    const order = await createElitePassOrderRecord(passDb, {
      name: data.name.trim(),
      usn: data.usn.toUpperCase().trim(),
      email: data.email.toLowerCase().trim(),
      phone: normalizePhone(data.phone),
      college: data.college.trim(),
      department: data.department?.trim() || null,
      year: data.year,
      transactionId: data.transactionId.trim(),
      amount: ELITE_PASS_PRICE,
      paymentScreenshotUrl: data.paymentScreenshotUrl || null,
    });

    return { data: order, error: null };
  } catch (error: any) {
    console.error("Error creating Elite Pass order:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = Array.isArray((error.meta as any)?.target) ? (error.meta as any).target.join(" ") : "";
        if (target.includes("transactionId")) {
          return { data: null, error: { transactionId: "This transaction ID already exists" } };
        }
        if (target.includes("usn")) {
          return { data: null, error: { usn: "An Elite Pass order already exists for this USN" } };
        }
        if (target.includes("email")) {
          return { data: null, error: { email: "An Elite Pass order already exists for this email" } };
        }
        return { data: null, error: "An Elite Pass order already exists with one of these details" };
      }

      if (error.code === "P2010") {
        return { data: null, error: "Database write failed. Please try again." };
      }
    }

    return {
      data: null,
      error:
        "Failed to create Elite Pass order",
    };
  }
}

export async function getElitePassOrders(): Promise<ServiceResponse<any[]>> {
  try {
    if (!(await isAdmin())) {
      return { data: null, error: "Unauthorized" };
    }

    const passDb = db as any;
    const orders = await listElitePassOrders(passDb);
    return { data: orders, error: null };
  } catch (error) {
    console.error("Error fetching Elite Pass orders:", error);
    return { data: null, error: "Failed to fetch Elite Pass orders" };
  }
}