import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

function getPrismaClient() {
	const existing = globalForPrisma.prisma
	const hasElitePassDelegate = !!(existing as any)?.elitePassOrder

	if (existing && hasElitePassDelegate) {
		return existing
	}

	const pool = new Pool({ connectionString: process.env.DATABASE_URL })
	const adapter = new PrismaPg(pool)
	return new PrismaClient({ adapter })
}

export const db = getPrismaClient()

globalForPrisma.prisma = db