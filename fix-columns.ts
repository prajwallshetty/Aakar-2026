import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Attempting to manually add columns via raw SQL...');
  try {
    // Check if type exists (Postgres stores unquoted as lowercase)
    const types: any[] = await prisma.$queryRawUnsafe(`SELECT typname FROM pg_type WHERE typname = 'paymentstatus' OR typname = 'PaymentStatus'`);
    if (types.length === 0) {
      console.log('Creating PaymentStatus enum...');
      await prisma.$executeRawUnsafe(`CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'FAILED')`);
    } else {
      console.log('PaymentStatus enum already exists.');
    }

    const columns: any[] = await prisma.$queryRawUnsafe(`SELECT column_name FROM information_schema.columns WHERE table_name = 'Participant'`);
    const colNames = columns.map(c => c.column_name);

    if (!colNames.includes('paymentStatus')) {
      console.log('Adding paymentStatus column...');
      await prisma.$executeRawUnsafe(`ALTER TABLE "Participant" ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING'`);
    }

    if (!colNames.includes('certificateSent')) {
      console.log('Adding certificateSent column...');
      await prisma.$executeRawUnsafe(`ALTER TABLE "Participant" ADD COLUMN "certificateSent" BOOLEAN NOT NULL DEFAULT false`);
    }

    if (!colNames.includes('certificateId')) {
      console.log('Adding certificateId column...');
      await prisma.$executeRawUnsafe(`ALTER TABLE "Participant" ADD COLUMN "certificateId" TEXT`);
      await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Participant_certificateId_key" ON "Participant"("certificateId")`);
    }

    console.log('Columns check/add completed.');
  } catch (err) {
    console.error('Failed to add columns manually:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
