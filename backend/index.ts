import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient()

globalForPrisma.prisma = db