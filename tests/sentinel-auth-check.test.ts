import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock firebase-admin before importing the module under test
vi.mock('firebase-admin', async () => {
  const mockAuthInstance = {
    verifyIdToken: vi.fn(),
  }

  const mockAdmin = {
    apps: [],
    credential: {
      cert: vi.fn(),
    },
    initializeApp: vi.fn(),
    auth: vi.fn(() => mockAuthInstance),
    firestore: vi.fn(() => ({
        collection: vi.fn(),
    })),
    app: vi.fn(() => ({})),
  }

  return {
    default: mockAdmin,
    ...mockAdmin
  }
})

// Also mock firebase-admin/firestore to avoid init errors
vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}))

import { verifySession, adminAuth } from '../src/lib/firebase-admin'

describe('Security Vulnerability Check: Implicit Admin Access', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('FIXED: should DENY admin access for generic @smartmotor.ae email (NEW BEHAVIOR)', async () => {
    // Setup mock to return a token with @smartmotor.ae email but NO admin role
    const mockToken = {
      uid: 'user123',
      email: 'random.user@smartmotor.ae',
      role: 'USER', // Explicitly NOT admin role
    }

    const verifyIdTokenMock = adminAuth.verifyIdToken as unknown as ReturnType<typeof vi.fn>
    verifyIdTokenMock.mockResolvedValue(mockToken)

    const result = await verifySession('some-valid-token')

    // Expect null because implicit wildcard access is removed
    expect(result).toBeNull()
  })

  it('should allow admin access for explicit ADMIN role', async () => {
    const mockToken = {
      uid: 'admin123',
      email: 'admin@otherdomain.com',
      role: 'ADMIN',
    }
    const verifyIdTokenMock = adminAuth.verifyIdToken as unknown as ReturnType<typeof vi.fn>
    verifyIdTokenMock.mockResolvedValue(mockToken)

    const result = await verifySession('admin-token')
    expect(result).toEqual(mockToken)
  })

  it('should allow admin access for hardcoded admin@smartmotor.ae', async () => {
    const mockToken = {
      uid: 'admin-hardcoded',
      email: 'admin@smartmotor.ae',
      role: 'USER', // Even if role is USER, email allowlist should grant access
    }
    const verifyIdTokenMock = adminAuth.verifyIdToken as unknown as ReturnType<typeof vi.fn>
    verifyIdTokenMock.mockResolvedValue(mockToken)

    const result = await verifySession('admin-token')
    expect(result).toEqual(mockToken)
  })

  it('should allow admin access for hardcoded dev@smartmotor.ae', async () => {
    const mockToken = {
      uid: 'dev-hardcoded',
      email: 'dev@smartmotor.ae',
      role: 'USER',
    }
    const verifyIdTokenMock = adminAuth.verifyIdToken as unknown as ReturnType<typeof vi.fn>
    verifyIdTokenMock.mockResolvedValue(mockToken)

    const result = await verifySession('dev-token')
    expect(result).toEqual(mockToken)
  })

  it('should deny access for non-admin email', async () => {
    const mockToken = {
      uid: 'user456',
      email: 'user@gmail.com',
      role: 'USER',
    }
    const verifyIdTokenMock = adminAuth.verifyIdToken as unknown as ReturnType<typeof vi.fn>
    verifyIdTokenMock.mockResolvedValue(mockToken)

    const result = await verifySession('user-token')
    expect(result).toBeNull()
  })
})
