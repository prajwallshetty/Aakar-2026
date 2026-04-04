import { NextResponse } from "next/server";
import { uploadMerchPaymentScreenshot } from "@/backend/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Payment screenshot is required" }, { status: 400 });
    }

    const publicUrl = await uploadMerchPaymentScreenshot(file);
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Merch upload error:", error);
    const message = error instanceof Error ? error.message : "Failed to upload screenshot";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
