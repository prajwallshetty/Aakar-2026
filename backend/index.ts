import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

function getPrismaClient() {
	const existing = globalForPrisma.prisma
	const hasElitePassDelegate = !!(existing as any)?.elitePassOrder

	if (existing && hasElitePassDelegate) {
		return existing
	}

	return new PrismaClient()
}

export const db = getPrismaClient()

globalForPrisma.prisma = db