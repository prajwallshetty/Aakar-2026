import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting manual SQL migration for ElitePassOrder...");

  try {
    // Add paymentStatus column if it doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ElitePassOrder' AND column_name = 'paymentStatus') THEN
          ALTER TABLE "ElitePassOrder" ADD COLUMN "paymentStatus" "PaymentStatus" DEFAULT 'PENDING';
        END IF;
      END
      $$;
    `);
    console.log("Verified 'paymentStatus' column.");

    // Add certificateSent column if it doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ElitePassOrder' AND column_name = 'certificateSent') THEN
          ALTER TABLE "ElitePassOrder" ADD COLUMN "certificateSent" BOOLEAN DEFAULT FALSE;
        END IF;
      END
      $$;
    `);
    console.log("Verified 'certificateSent' column.");

    console.log("Manual SQL migration for ElitePassOrder completed successfully.");
  } catch (error) {
    console.error("Error during manual SQL migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
