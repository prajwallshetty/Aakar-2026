import { db } from "../backend/index";
import { eventType } from "@prisma/client";

async function test() {
  try {
    const soloEvents = await db.event.findMany({
      where: { eventType: eventType.Solo },
    });
    console.log("Solo events found:", soloEvents.length);
    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

test();
