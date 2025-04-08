import { isAdmin } from "@/backend/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { email } = await req.json();
    if (!email) {
        return NextResponse.json({ isAdmin: false })
    }

    const isA = await isAdmin(email);
    return NextResponse.json({ isAdmin: isA })
}