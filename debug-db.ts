import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Querying all columns for Table: Participant...');
  const columns: any[] = await prisma.$queryRawUnsafe("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Participant' ORDER BY column_name");
  console.log('Columns count:', columns.length);
  columns.forEach(c => console.log(`- ${c.column_name} (${c.data_type})`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
