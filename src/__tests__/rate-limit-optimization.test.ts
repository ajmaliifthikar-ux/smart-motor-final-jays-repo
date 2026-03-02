import { vi, describe, it, expect, beforeEach } from 'vitest'

// Use vi.hoisted to create mock objects that can be referenced inside vi.mock factory
const { prismaMock, redisMock, pipelineMock } = vi.hoisted(() => {
  const pipeline = {
    zremrangebyscore: vi.fn().mockReturnThis(),
    zcount: vi.fn().mockReturnThis(),
    expire: vi.fn().mockReturnThis(),
    zadd: vi.fn().mockReturnThis(),
    exec: vi.fn(),
  }

  const redis = {
    exists: vi.fn(),
    pipeline: vi.fn(() => pipeline),
    on: vi.fn(),
  }

  const prisma = {
    aIUsageLog: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  }

  return {
    prismaMock: prisma,
    redisMock: redis,
    pipelineMock: pipeline,
  }
})

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

vi.mock('@/lib/redis', () => ({
  default: redisMock,
}))

import { checkRateLimit } from '@/lib/rate-limit'

describe('checkRateLimit Optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default behaviors
    // Default: key exists, limit not exceeded
    redisMock.exists.mockResolvedValue(1)
    pipelineMock.exec.mockResolvedValue([
      [null, 1], // zremrangebyscore
      [null, 5], // zcount (usage < limit)
      [null, 1], // expire (key exists)
    ])
  })

  it('should use 1 RTT (pipeline only) when key exists (optimized behavior)', async () => {
    const result = await checkRateLimit('user1', 'action1', 10, 3600)

    expect(result).toBe(true)

    // Verify exists was NOT called (Optimization)
    expect(redisMock.exists).toHaveBeenCalledTimes(0)

    // Verify pipeline was created and executed once
    expect(redisMock.pipeline).toHaveBeenCalledTimes(1)
    expect(pipelineMock.exec).toHaveBeenCalledTimes(1)
  })

  it('should fallback to DB and hydrate Redis when key is missing (optimized behavior)', async () => {
    // Setup pipeline for missing key:
    // expire (index 2) returns 0
    pipelineMock.exec
      .mockResolvedValueOnce([
          [null, 0], // zremrangebyscore (nothing to remove)
          [null, 0], // zcount (nothing to count)
          [null, 0]  // expire (key missing)
      ])
      .mockResolvedValueOnce([ [null, 2], [null, 1] ]) // Hydration pipeline: zadd, expire

    // Setup DB response
    prismaMock.aIUsageLog.findMany.mockResolvedValue([
        { createdAt: new Date() },
        { createdAt: new Date() }
    ])

    const result = await checkRateLimit('user1', 'action1', 10, 3600)

    expect(result).toBe(true)

    // Verify exists was NOT called
    expect(redisMock.exists).toHaveBeenCalledTimes(0)

    // Verify DB was called
    expect(prismaMock.aIUsageLog.findMany).toHaveBeenCalledTimes(1)

    // Verify pipelines were executed twice (1 check + 1 hydration)
    expect(redisMock.pipeline).toHaveBeenCalledTimes(2)
    expect(pipelineMock.exec).toHaveBeenCalledTimes(2)
  })
})
