import { NextRequest, NextResponse } from "next/server";
import { verifyElitePass } from "@/backend/elite-pass";

export async function POST(req: NextRequest) {
  try {
    const { uuid } = await req.json();

    if (!uuid) {
      return NextResponse.json({ error: "UUID is required" }, { status: 400 });
    }

    const { data, error } = await verifyElitePass(uuid);

    if (error) {
      return NextResponse.json({ error }, { status: error === "Invalid QR" ? 404 : 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error [verify-elite-pass]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
