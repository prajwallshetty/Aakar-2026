"use server";

import { eventType, Prisma, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { db } from ".";
import { isAdmin } from "./admin";
import { sendEmail } from "./nodemailer";
import { generateElitePassPDF } from "./elite-pass-pdf";
import { checkRateLimit } from "./ratelimit";

function getElitePassPrice() {
  const isEarlyBird = new Date() < new Date("2026-04-21T00:00:00+05:30");
  return isEarlyBird ? 399 : 459;
}

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
  eventIds: number[];
};

type ServiceResponse<T> = {
  data: T | null;
  error: { [key: string]: string } | string | null;
};

type ElitePassDuplicateCheckInput = {
  email?: string;
  usn?: string;
  transactionId?: string;
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

async function listElitePassOrders(client: any, index?: number, limit?: number) {
  const elitePassOrder = getElitePassOrderDelegate(client);

  if (elitePassOrder) {
    if (index !== undefined && limit !== undefined) {
      return elitePassOrder.findMany({ orderBy: { createdAt: "desc" }, skip: index * limit, take: limit });
    }
    return elitePassOrder.findMany({ orderBy: { createdAt: "desc" } });
  }

  await ensureElitePassOrderTable(client);

  let limitClause = "";
  if (index !== undefined && limit !== undefined) {
    limitClause = `LIMIT ${limit} OFFSET ${index * limit}`;
  }

  return client.$queryRawUnsafe(`
    SELECT *
    FROM "ElitePassOrder"
    ORDER BY "createdAt" DESC
    ${limitClause}
  `);
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
  if (!Array.isArray(data.eventIds) || data.eventIds.length < 1) errors.eventIds = "Select at least one solo event";
  if (Array.isArray(data.eventIds) && data.eventIds.some((id) => !Number.isInteger(id) || id <= 0)) errors.eventIds = "Invalid event selection";

  return Object.keys(errors).length > 0 ? errors : null;
}

export async function checkElitePassDuplicates(input: ElitePassDuplicateCheckInput): Promise<{ [key: string]: string } | null> {
  if (!(await checkRateLimit(15, 60000))) {
    return { _rateLimit: "Too many duplicate check requests." };
  }

  const errors: { [key: string]: string } = {};

  const normalizedEmail = input.email?.toLowerCase().trim();
  const normalizedUsn = input.usn?.toUpperCase().trim();
  const normalizedTransactionId = input.transactionId?.trim();

  if (!normalizedEmail && !normalizedUsn && !normalizedTransactionId) {
    return null;
  }

  const where: any = { OR: [] as any[] };
  if (normalizedEmail) where.OR.push({ email: normalizedEmail });
  if (normalizedUsn) where.OR.push({ usn: normalizedUsn });
  if (normalizedTransactionId) where.OR.push({ transactionId: normalizedTransactionId });

  const existing = await (db as any).elitePassOrder.findFirst({
    where,
    select: {
      email: true,
      usn: true,
      transactionId: true,
    },
  });

  if (!existing) return null;

  if (normalizedEmail && existing.email?.toLowerCase() === normalizedEmail) {
    errors.email = "An Elite Pass order already exists for this email";
  }

  if (normalizedUsn && existing.usn?.toUpperCase() === normalizedUsn) {
    errors.usn = "An Elite Pass order already exists for this USN";
  }

  if (normalizedTransactionId && existing.transactionId === normalizedTransactionId) {
    errors.transactionId = "This transaction ID already exists";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

async function validateSoloEvents(eventIds: number[]): Promise<boolean> {
  if (!eventIds.length) return false;

  const soloEvents = await db.event.findMany({
    where: {
      id: { in: eventIds },
      eventType: eventType.Solo,
    },
    select: { id: true },
  });

  return new Set(soloEvents.map((event) => event.id)).size === new Set(eventIds).size;
}

async function syncParticipantWithElitePass(
  client: any,
  payload: {
    name: string;
    usn: string;
    email: string;
    phone: string;
    college: string;
    department: string | null;
    year: number;
    transactionId: string;
    paymentScreenshotUrl: string | null;
    eventIds: number[];
  },
) {
  const existingParticipant = await client.participant.findFirst({
    where: {
      OR: [{ email: payload.email }, { usn: payload.usn }],
    },
    select: {
      id: true,
      transaction_ids: true,
      paymentScreenshotUrls: true,
      amount: true,
    },
  });

  if (existingParticipant) {
    return client.participant.update({
      where: { id: existingParticipant.id },
      data: {
        name: payload.name,
        phone: payload.phone,
        college: payload.college,
        department: payload.department,
        year: payload.year,
        amount: (existingParticipant.amount || 0) + getElitePassPrice(),
        transaction_ids: Array.from(new Set([...(existingParticipant.transaction_ids || []), payload.transactionId])),
        paymentScreenshotUrls: Array.from(
          new Set([...(existingParticipant.paymentScreenshotUrls || []), ...(payload.paymentScreenshotUrl ? [payload.paymentScreenshotUrl] : [])]),
        ),
        events: {
          connect: payload.eventIds.map((id) => ({ id })),
        },
      },
    });
  }

  return client.participant.create({
    data: {
      name: payload.name,
      usn: payload.usn,
      email: payload.email,
      phone: payload.phone,
      college: payload.college,
      department: payload.department,
      year: payload.year,
      amount: getElitePassPrice(),
      transaction_ids: [payload.transactionId],
      paymentScreenshotUrls: payload.paymentScreenshotUrl ? [payload.paymentScreenshotUrl] : [],
      events: {
        connect: payload.eventIds.map((id) => ({ id })),
      },
    },
  });
}

export async function createElitePassOrder(data: ElitePassOrderInput): Promise<ServiceResponse<any>> {
  try {
    if (!(await checkRateLimit(10, 60000))) {
      return { data: null, error: "Too many requests. Please try again later." };
    }

    const passDb = db as any;

    const validationErrors = await validateElitePassOrderData(data);
    if (validationErrors) {
      return { data: null, error: validationErrors };
    }

    const duplicateErrors = await checkElitePassDuplicates({
      email: data.email,
      usn: data.usn,
      transactionId: data.transactionId,
    });
    if (duplicateErrors) {
      return { data: null, error: duplicateErrors };
    }

    const normalizedEventIds = Array.from(new Set(data.eventIds.map((id) => Number(id))));
    const hasValidSoloEvents = await validateSoloEvents(normalizedEventIds);
    if (!hasValidSoloEvents) {
      return { data: null, error: { eventIds: "Please select valid solo events" } };
    }

    const normalizedPayload = {
      name: data.name.trim(),
      usn: data.usn.toUpperCase().trim(),
      email: data.email.toLowerCase().trim(),
      phone: normalizePhone(data.phone),
      college: data.college.trim(),
      department: data.department?.trim() || null,
      year: data.year,
      transactionId: data.transactionId.trim(),
      paymentScreenshotUrl: data.paymentScreenshotUrl || null,
      eventIds: normalizedEventIds,
    };

    const order = await passDb.$transaction(async (tx: any) => {
      const createdOrder = await createElitePassOrderRecord(tx, {
        name: normalizedPayload.name,
        usn: normalizedPayload.usn,
        email: normalizedPayload.email,
        phone: normalizedPayload.phone,
        college: normalizedPayload.college,
        department: normalizedPayload.department,
        year: normalizedPayload.year,
        transactionId: normalizedPayload.transactionId,
        amount: getElitePassPrice(),
        paymentScreenshotUrl: normalizedPayload.paymentScreenshotUrl,
      });

      await syncParticipantWithElitePass(tx, normalizedPayload);
      return createdOrder;
    }, {
      maxWait: 10000,
      timeout: 20000,
    });

    if (order) {
      // Fetch event names for the email
      let eventNames: string[] = [];
      try {
        const events = await db.event.findMany({
          where: { id: { in: normalizedEventIds } },
          select: { eventName: true },
        });
        eventNames = events.map((e) => e.eventName);
      } catch (err) {
        console.error('Failed to fetch event names for email:', err);
      }

      // Generate personalized Elite Pass PDF with unique verification QR
      let pdfBuffer: Buffer | null = null;
      try {
        pdfBuffer = await generateElitePassPDF(order.name, order.usn, order.uuid);
      } catch (pdfError) {
        console.error('Failed to generate Elite Pass PDF, sending email without attachment:', pdfError);
      }

      const attachments = pdfBuffer
        ? [{
            filename: `Aakar2026_ElitePass_${order.name.replace(/\s+/g, '_')}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          }]
        : undefined;

      // Build a simple, clean email body
      const eventListHtml = eventNames.length > 0
        ? eventNames.map((name) => `<li>${name}</li>`).join('')
        : '<li>Events will be confirmed shortly</li>';

      const emailHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(135deg, #0a0a2e, #1a0033); padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 2px;">ELITE PASS CONFIRMED</h1>
            <p style="margin: 8px 0 0; color: #a78bfa; font-size: 13px; letter-spacing: 1px;">AAKAR 2026</p>
          </div>
          <div style="padding: 28px 24px;">
            <p style="margin: 0 0 20px; color: #1f2937; font-size: 15px; line-height: 1.6;">
              Hi <strong>${order.name}</strong>,<br/>Your Elite Pass for Aakar 2026 has been received. Your pass is attached to this email as a PDF.
            </p>
            <div style="background: #f8f9fa; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Registered Events</p>
              <ul style="margin: 0; padding-left: 18px; color: #374151; font-size: 14px; line-height: 1.8;">
                ${eventListHtml}
              </ul>
            </div>
            <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
              Please present the attached Elite Pass at the registration desk during the event.
            </p>
          </div>
          <div style="background: #f3f4f6; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #9ca3af; font-size: 11px;">Aakar 2026 &bull; A.J. Institute of Engineering &amp; Technology</p>
          </div>
        </div>
      `;

      await sendEmail(
        order.email,
        "Elite Pass Confirmed - Aakar 2026",
        emailHtml,
        attachments
      );
    }

    return { data: order, error: null };
  } catch (error: any) {
    console.error("Error creating Elite Pass order:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = Array.isArray((error.meta as any)?.target) 
          ? (error.meta as any).target.join(" ").toLowerCase() 
          : typeof (error.meta as any)?.target === "string"
          ? ((error.meta as any).target as string).toLowerCase()
          : "";
          
        if (target.includes("transactionid")) {
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

      if (error.code === "P2028") {
        return { data: null, error: "Request timed out while saving. Please try again." };
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      data: null,
      error: `Failed to create Elite Pass order: ${errorMessage}`,
    };
  }
}

export async function getElitePassOrders(index?: number, limit?: number): Promise<ServiceResponse<any[]>> {
  try {
    if (!(await isAdmin())) {
      return { data: null, error: "Unauthorized" };
    }

    const passDb = db as any;
    const orders = await listElitePassOrders(passDb, index, limit);
    return { data: orders, error: null };
  } catch (error) {
    console.error("Error fetching Elite Pass orders:", error);
    return { data: null, error: "Failed to fetch Elite Pass orders" };
  }
}

export async function updateElitePassOrder(id: number, data: any): Promise<ServiceResponse<any>> {
  try {
    if (!(await isAdmin())) {
      return { data: null, error: "Unauthorized" };
    }

    // Attempt to update via standard delegate first
    try {
      const updated = await (db as any).elitePassOrder.update({
        where: { id },
        data
      });
      return { data: updated, error: null };
    } catch (prismaErr) {
      // Fallback to raw SQL if Prisma client is stale and doesn't recognize new columns
      console.warn("Prisma update failed, attempting raw SQL fallback:", prismaErr);

      if (data.paymentStatus !== undefined || data.certificateSent !== undefined) {
        const updates: string[] = [];
        if (data.paymentStatus !== undefined) updates.push(`"paymentStatus" = '${data.paymentStatus}'`);
        if (data.certificateSent !== undefined) updates.push(`"certificateSent" = ${data.certificateSent}`);
        updates.push(`"updatedAt" = CURRENT_TIMESTAMP`);

        if (updates.length > 0) {
          await db.$executeRawUnsafe(`
            UPDATE "ElitePassOrder"
            SET ${updates.join(', ')}
            WHERE "id" = ${id}
          `);

          // Return the updated object by fetching it
          const result = await db.$queryRaw<any[]>`SELECT * FROM "ElitePassOrder" WHERE "id" = ${id}`;
          return { data: result[0], error: null };
        }
      }
      throw prismaErr;
    }
  } catch (error) {
    console.error("Error updating Elite Pass order:", error);
    return { data: null, error: "Failed to update Elite Pass order" };
  }
}