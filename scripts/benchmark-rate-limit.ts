import { PrismaClient } from '@prisma/client'
import { checkRateLimit } from '../src/lib/rate-limit'
import redis from '../src/lib/redis'

const prisma = new PrismaClient()

async function main() {
  const userId = 'benchmark-user-' + Date.now()
  const action = 'GENERATE_ARTICLE'
  const windowSeconds = 3600
  const limit = 100

  console.log('--- Setting up benchmark ---')

  // Seed 5 usage logs in the last hour
  const now = new Date()
  const logs = []
  for (let i = 0; i < 5; i++) {
    logs.push({
      userId,
      action,
      model: 'benchmark-model',
      createdAt: new Date(now.getTime() - (i * 1000 * 60 * 5)) // 0, 5, 10, 15, 20 mins ago
    })
  }

  await prisma.aIUsageLog.createMany({
    data: logs
  })

  console.log('--- Running benchmark (100 iterations) ---')

  const start = performance.now()

  for (let i = 0; i < 100; i++) {
    await checkRateLimit(userId, action, limit, windowSeconds)
  }

  const end = performance.now()
  const totalTime = end - start
  const avgTime = totalTime / 100

  console.log(`Total Time: ${totalTime.toFixed(2)}ms`)
  console.log(`Average Time per Call: ${avgTime.toFixed(2)}ms`)

  // Cleanup
  await prisma.aIUsageLog.deleteMany({
    where: { userId }
  })

  console.log('--- Cleanup complete ---')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    redis.disconnect() // Force disconnect
    process.exit(0)
  })
