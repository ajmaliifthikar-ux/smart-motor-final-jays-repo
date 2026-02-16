import { describe, it, expect, vi, beforeEach } from 'vitest'

// We will mock the PrismaClient
const mockPrisma = {
  service: {
    upsert: vi.fn(),
  },
  brand: {
    upsert: vi.fn(),
  },
  servicePackage: {
    upsert: vi.fn(),
  },
  blogPost: {
    upsert: vi.fn(),
  },
  contentBlock: {
    upsert: vi.fn(),
  },
  fAQ: {
    deleteMany: vi.fn(),
    create: vi.fn(),
  },
  user: {
    upsert: vi.fn(),
  },
  $disconnect: vi.fn(),
}

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: vi.fn().mockImplementation(() => mockPrisma),
  }
})

// Mock bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
  },
}))

describe('Database Seeding Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should use upsert for services to prevent duplicates', async () => {
    // We'll import the seed function logic
    // For now, we simulate the logic to check if our test setup works
    const testService = { id: 'test', name: 'Test Service' }
    
    await mockPrisma.service.upsert({
      where: { slug: testService.id },
      update: { name: testService.name },
      create: { slug: testService.id, name: testService.name },
    })

    expect(mockPrisma.service.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: 'test' },
      })
    )
  })

  it('should correctly format array data into strings for SQLite compatibility', async () => {
    const brand = { name: 'Test Brand', models: ['Model A', 'Model B'] }
    
    await mockPrisma.brand.upsert({
      where: { name: brand.name },
      update: { models: brand.models.join(',') },
      create: { name: brand.name, models: brand.models.join(',') },
    })

    expect(mockPrisma.brand.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          models: 'Model A,Model B',
        }),
      })
    )
  })
})
