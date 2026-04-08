import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const participants = await prisma.participant.findMany({
    take: 5,
    select: {
      paymentScreenshotUrls: true
    }
  })
  console.log('Participant Screenshots:', JSON.stringify(participants, null, 2))
  
  const events = await prisma.event.findMany({
    select: {
      id: true,
      eventName: true,
      imageUrl: true
    }
  })
  console.log('Event Images:', JSON.stringify(events, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
