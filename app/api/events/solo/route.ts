import { eventType } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/backend";

export async function GET() {
  try {
    const soloEvents = await db.event.findMany({
      where: { eventType: eventType.Solo },
      select: {
        id: true,
        eventName: true,
        eventCategory: true,
        fee: true,
        date: true,
      },
      orderBy: [{ eventCategory: "asc" }, { eventName: "asc" }],
    });

    return NextResponse.json({ data: soloEvents });
  } catch (error) {
    console.error("Error fetching solo events:", error);
    return NextResponse.json(
      { error: "Failed to fetch solo events" },
      { status: 500 },
    );
  }
}
