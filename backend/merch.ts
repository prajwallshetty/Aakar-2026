"use server";

import { Prisma } from "@prisma/client";
import { db } from ".";
import { isAdmin } from "./admin";

const MERCH_PRICE = 499;


type MerchOrderInput = {
  name: string;
  usn: string;
  email: string;
  phone: string;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | "XXXXL";
  transactionId: string;
  paymentScreenshotUrl?: string;
};

type ServiceResponse<T> = {
  data: T | null;
  error: { [key: string]: string } | string | null;
};

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

export async function validateMerchOrderData(data: MerchOrderInput): Promise<{ [key: string]: string } | null> {
  const errors: { [key: string]: string } = {};
  const merchDb = db as any;

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name is required";
  }

  if (!data.usn || data.usn.trim().length < 4) {
    errors.usn = "USN is required";
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

  const normalizedUsn = data.usn.toUpperCase();
  const normalizedEmail = data.email.toLowerCase();
  const normalizedTransactionId = data.transactionId.trim();

  const existingOrders = await merchDb.merchOrder.findMany({
    where: {
      transactionId: normalizedTransactionId,
    },
    select: {
      usn: true,
      email: true,
      transactionId: true,
    },
  });

  const hasTransactionId = existingOrders.some(
    (order: { transactionId: string }) => order.transactionId === normalizedTransactionId,
  );

  if (hasTransactionId) {
    errors.transactionId = "This transaction ID already exists";
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

    const order = await merchDb.merchOrder.create({
      data: {
        name: data.name.trim(),
        usn: data.usn.toUpperCase().trim(),
        email: data.email.toLowerCase().trim(),
        phone: normalizePhone(data.phone),
        size: data.size,
        transactionId: data.transactionId.trim(),
        amount: MERCH_PRICE,
        paymentScreenshotUrl: data.paymentScreenshotUrl || null,
      },
    });

    return { data: order, error: null };
  } catch (error) {
    console.error("Error creating merch order:", error);
    return {
      data: null,
      error:
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
          ? "A merch order with this transaction ID already exists"
          : "Failed to create merch order",
    };
  }
}

export async function getMerchOrders(): Promise<ServiceResponse<any[]>> {
  try {
    if (!(await isAdmin())) {
      return { data: null, error: "Unauthorized" };
    }

    const merchDb = db as any;
    const orders = await merchDb.merchOrder.findMany({ orderBy: { createdAt: "desc" } });
    return { data: orders, error: null };
  } catch (error) {
    console.error("Error fetching merch orders:", error);
    return { data: null, error: "Failed to fetch merch orders" };
  }
}

export async function getMerchOrdersCount(): Promise<number> {
  if (!(await isAdmin())) return 0;
  return (db as any).merchOrder.count();
}