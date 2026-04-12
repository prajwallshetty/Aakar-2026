import { registerParticipant } from "./backend/participant";
import { createElitePassOrder } from "./backend/elite-pass";
import { createMerchOrder } from "./backend/merch";
import { db } from "./backend";

async function main() {
  console.log("Starting simultaneous testing for Normal Registration, Elite Pass, and Merch Purchase...\n");

  // Fetch some valid solo event for the elite pass and normal registration
  const soloEvent = await db.event.findFirst({
    where: { eventType: "Solo" },
    select: { id: true }
  });

  if (!soloEvent) {
    console.error("❌ No Solo event found in the database. Please add one first.");
    process.exit(1);
  }

  const eventId = soloEvent.id;
  const timestamp = Date.now();
  const testUSN = `TST${timestamp.toString().slice(-4)}`;
  const testEmailBase = `test_user_${timestamp}`;
  const transactionIdBase = `TXN_${timestamp}`;

  // 1. Participant Data
  const participantData = {
    name: "Test Participant",
    email: `${testEmailBase}_reg@example.com`,
    phone: "9999999999",
    college: "Test College",
    year: 1,
    usn: `${testUSN}REG`,
    transaction_ids: [`${transactionIdBase}_REG`],
    paymentScreenshotUrls: ["https://example.com/screenshot.jpg"],
    amount: 100
  };

  // 2. Elite Pass Data
  const elitePassData = {
    name: "Test Elite Pass",
    usn: `${testUSN}ELT`,
    email: `${testEmailBase}_elt@example.com`,
    phone: "9999999998",
    college: "Test Elite College",
    department: "Test Dept",
    year: 2,
    transactionId: `${transactionIdBase}_ELT`,
    paymentScreenshotUrl: "https://example.com/elt_screenshot.jpg",
    eventIds: [eventId]
  };

  // 3. Merch Order Data
  const merchData = {
    name: "Test Merch Buyer",
    email: `${testEmailBase}_mrch@example.com`,
    phone: "9999999997",
    merchVariant: "ignite" as const,
    size: "M" as const,
    transactionId: `${transactionIdBase}_MRCH`,
  };

  console.log("Mock Data Generated:");
  console.log("- Reg Email:", participantData.email);
  console.log("- Elite Pass Email:", elitePassData.email);
  console.log("- Merch Email:", merchData.email);
  console.log("\nExecuting requests concurrently...");

  const [regResult, elitePassResult, merchResult] = await Promise.allSettled([
    registerParticipant(participantData, [eventId]),
    createElitePassOrder(elitePassData),
    createMerchOrder(merchData)
  ]);

  console.log("\n=== RESULTS ===");

  if (regResult.status === "fulfilled") {
    console.log("✅ Registration Result:", JSON.stringify(regResult.value, null, 2));
  } else {
    console.error("❌ Registration Threw Error:", regResult.reason);
  }

  if (elitePassResult.status === "fulfilled") {
    console.log("✅ Elite Pass Result:", JSON.stringify(elitePassResult.value, null, 2));
  } else {
    console.error("❌ Elite Pass Threw Error:", elitePassResult.reason);
  }

  if (merchResult.status === "fulfilled") {
    console.log("✅ Merch Order Result:", JSON.stringify(merchResult.value, null, 2));
  } else {
    console.error("❌ Merch Order Threw Error:", merchResult.reason);
  }

  console.log("\n[!] Note: If nodemailer is configured, confirmation emails may have been sent to these dummy addresses.");
  
  process.exit(0);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
