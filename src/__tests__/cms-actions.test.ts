import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateContentBlock, restoreContentVersion } from '../actions/cms-actions'
import { prisma } from '../lib/prisma'
import { auth } from '../auth'

vi.mock('../lib/prisma', () => ({
  prisma: {
    contentBlock: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
    contentHistory: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    contentAudit: {
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}))

vi.mock('../auth', () => ({
  auth: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('CMS Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(auth as any).mockResolvedValue({
      user: { id: 'admin-1', role: 'ADMIN', name: 'Admin User' },
    })
  })

  it('should create audit log and history snapshot on updateContentBlock', async () => {
    const formData = new FormData()
    formData.append('key', 'hero_title')
    formData.append('value', 'New Title')
    
    ;(prisma.contentBlock.findUnique as any).mockResolvedValue({
      key: 'hero_title',
      value: 'Old Title',
      type: 'text',
      status: 'PUBLISHED',
    })

    await updateContentBlock(formData)

    expect(prisma.contentHistory.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          key: 'hero_title',
          entityType: 'ContentBlock',
        }),
      })
    )

    expect(prisma.contentAudit.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          key: 'hero_title',
          updatedBy: 'Admin User',
        }),
      })
    )
  })

  it('should restore content from a snapshot', async () => {
    const snapshot = JSON.stringify({
      value: 'Restored Value',
      type: 'text',
      status: 'PUBLISHED',
    })

    ;(prisma.contentHistory.findUnique as any).mockResolvedValue({
      id: 'hist-1',
      key: 'hero_title',
      entityType: 'ContentBlock',
      snapshot,
    })

    await restoreContentVersion('hist-1')

    expect(prisma.contentBlock.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: 'hero_title' },
        data: expect.objectContaining({
          value: 'Restored Value',
        }),
      })
    )
  })
})
