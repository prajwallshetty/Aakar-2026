"use server";

import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { db } from ".";
import { isAdmin } from "./admin";
import { sendEmail } from "./nodemailer";
import { buildMerchEmail, buildMerchAdminNotificationEmail } from "./email-templates";

const variantPriceMap = {
  classic: 499,
  neon: 549,
  pro: 599,
} as const;

function normalizeMerchVariant(variant: string | undefined) {
  if (!variant) return "classic";
  return variant in variantPriceMap ? (variant as keyof typeof variantPriceMap) : "classic";
}

function inferVariantFromAmount(amount: number | null | undefined): keyof typeof variantPriceMap {
  if (amount === 549) return "neon";
  if (amount === 599) return "pro";
  return "classic";
}


type MerchOrderInput = {
  name: string;
  email: string;
  phone: string;
  merchVariant?: string;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | "XXXXL";
  transactionId: string;
  paymentScreenshotUrl?: string;
};

type ServiceResponse<T> = {
  data: T | null;
  error: { [key: string]: string } | string | null;
};

let ensuredMerchOrderIndexes = false;

async function ensureMerchOrderIndexes(client: any) {
  if (ensuredMerchOrderIndexes) return;

  // Remove legacy USN artifacts from older schemas so merch orders no longer require USN.
  await client.$executeRawUnsafe(`DROP INDEX IF EXISTS "MerchOrder_usn_key";`);
  await client.$executeRawUnsafe(`ALTER TABLE IF EXISTS "MerchOrder" DROP COLUMN IF EXISTS "usn";`);

  ensuredMerchOrderIndexes = true;
}

function getUniqueConstraintField(error: Prisma.PrismaClientKnownRequestError): string {
  const target = (error.meta as { target?: string[] | string } | undefined)?.target;
  if (Array.isArray(target)) return target.join(" ").toLowerCase();
  if (typeof target === "string") return target.toLowerCase();
  return "";
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

async function createMerchOrderRaw(client: any, baseData: {
  name: string;
  email: string;
  phone: string;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | "XXXXL";
  transactionId: string;
  amount: number;
  paymentScreenshotUrl: string | null;
}) {
  const now = new Date();

  const inserted = await client.$queryRaw<Array<any>>`
    INSERT INTO "MerchOrder"
      ("uuid", "name", "email", "phone", "size", "transactionId", "amount", "paymentScreenshotUrl", "createdAt", "updatedAt")
    VALUES
      (${randomUUID()}, ${baseData.name}, ${baseData.email}, ${baseData.phone}, ${baseData.size}::"tshirtSize", ${baseData.transactionId}, ${baseData.amount}, ${baseData.paymentScreenshotUrl}, ${now}, ${now})
    RETURNING *
  `;

  return inserted[0] ?? null;
}

export async function validateMerchOrderData(data: MerchOrderInput): Promise<{ [key: string]: string } | null> {
  const errors: { [key: string]: string } = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name is required";
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Valid email is required";
  }

  const normalizedPhone = normalizePhone(data.phone || "");
  if (!normalizedPhone || !/^\d{10}$/.test(normalizedPhone)) {
    errors.phone = "Valid 10-digit phone number is required";
  }

  if (!data.size) {
    errors.size = "Please choose a size";
  }

  if (!data.transactionId || data.transactionId.trim().length < 4) {
    errors.transactionId = "Transaction ID is required";
  }

  // Skip DB round-trips when basic field validation already failed.
  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export async function createMerchOrder(data: MerchOrderInput): Promise<ServiceResponse<any>> {
  try {
    const merchDb = db as any;

    const validationErrors = await validateMerchOrderData(data);
    if (validationErrors) {
      return { data: null, error: validationErrors };
    }

    const merchVariant = normalizeMerchVariant(data.merchVariant);
    const merchAmount = variantPriceMap[merchVariant];

    const baseData = {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: normalizePhone(data.phone),
      size: data.size,
      transactionId: data.transactionId.trim(),
      amount: merchAmount,
      paymentScreenshotUrl: data.paymentScreenshotUrl || null,
    };

    try {
      await ensureMerchOrderIndexes(merchDb);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (!message.includes("does not exist")) {
        throw error;
      }
    }

    const order = await createMerchOrderRaw(merchDb, baseData);

    if (order) {
      const resolvedVariant = order.merchVariant || inferVariantFromAmount(order.amount);
      const adminEmail = process.env.ADMIN_EMAIL;

      // Do not block the checkout response on SMTP/network latency.
      void Promise.allSettled([
        sendEmail(
          order.email,
          `Merch Order Confirmed – Aakar 2025! 👕`,
          buildMerchEmail(order.name, resolvedVariant, order.size, order.transactionId)
        ),
        ...(adminEmail
          ? [
              sendEmail(
                adminEmail,
                `New Merch Order: ${order.name} (${resolvedVariant})`,
                buildMerchAdminNotificationEmail({
                  ...order,
                  merchVariant: resolvedVariant,
                })
              ),
            ]
          : []),
      ]);
    }

    return { data: order, error: null };
  } catch (error) {
    console.error("Error creating merch order:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = getUniqueConstraintField(error);

      if (target.includes("transactionid")) {
        return { data: null, error: { transactionId: "This transaction ID already exists" } };
      }
      if (target.includes("email")) {
        return { data: null, error: { email: "A merch order already exists for this email" } };
      }

      return {
        data: null,
        error: "A merch order already exists with one of these details",
      };
    }

    return {
      data: null,
      error: "Failed to create merch order",
    };
  }
}

export async function getMerchOrders(): Promise<ServiceResponse<any[]>> {
  try {
    if (!(await isAdmin())) {
      return { data: null, error: "Unauthorized" };
    }

    const merchDb = db as any;
    const orders = await merchDb.$queryRaw<Array<any>>`
      SELECT
        "id",
        "uuid",
        "name",
        "email",
        "phone",
        "size",
        "transactionId",
        "amount",
        "paymentScreenshotUrl",
        "createdAt",
        "updatedAt"
      FROM "MerchOrder"
      ORDER BY "createdAt" DESC
    `;
    const normalizedOrders = (orders || []).map((order: any) => ({
      ...order,
      merchVariant: order.merchVariant || inferVariantFromAmount(order.amount),
    }));
    return { data: normalizedOrders, error: null };
  } catch (error) {
    console.error("Error fetching merch orders:", error);
    return { data: null, error: "Failed to fetch merch orders" };
  }
}

export async function getMerchOrdersCount(): Promise<number> {
  if (!(await isAdmin())) return 0;
  const result = await (db as any).$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*)::bigint AS count
    FROM "MerchOrder"
  `;
  return Number(result[0]?.count ?? 0);
}