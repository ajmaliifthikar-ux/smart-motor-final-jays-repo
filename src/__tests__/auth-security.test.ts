import { describe, it, expect, vi, beforeEach } from 'vitest'

// Use vi.hoisted to ensure the mock is available in the mock factory
const mocks = vi.hoisted(() => {
  return {
    verifyIdTokenMock: vi.fn(),
  }
})

vi.mock('firebase-admin', () => {
  return {
    default: {
      apps: [],
      initializeApp: vi.fn(),
      auth: () => ({
        verifyIdToken: mocks.verifyIdTokenMock,
      }),
      credential: {
        cert: vi.fn(),
      },
      app: () => ({}),
    },
  }
})

vi.mock('firebase-admin/firestore', () => {
  return {
    getFirestore: () => ({
      collection: () => ({
        doc: () => ({
          get: vi.fn(),
          set: vi.fn(),
        }),
      }),
    }),
  }
})

// Import the function to test
import { verifySession } from '@/lib/firebase-admin'

describe('Security: verifySession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should REJECT a user with @smartmotor.ae email but NO admin role (VULNERABILITY REPRODUCTION)', async () => {
    // Setup: A user with @smartmotor.ae email but regular USER role
    mocks.verifyIdTokenMock.mockResolvedValue({
      uid: 'hacker-123',
      email: 'hacker@smartmotor.ae',
      role: 'USER', // Explicitly NOT admin
    })

    // Act: Verify session
    const result = await verifySession('some-token')

    // Assert:
    // CURRENTLY (Vulnerable): It returns the token because of the email whitelist
    // EXPECTED (Secure): It should return null

    // For reproduction, we assert the CURRENT INSECURE behavior to confirm the test works.
    // Wait, the plan says: "Assert that verifySession returns null (secure behavior). Verify that this test FAILS"

    expect(result).toBeNull()
  })

  it('should ALLOW a user with ADMIN role', async () => {
    mocks.verifyIdTokenMock.mockResolvedValue({
      uid: 'admin-123',
      email: 'admin@example.com',
      role: 'ADMIN',
    })

    const result = await verifySession('valid-admin-token')
    expect(result).not.toBeNull()
    expect(result?.uid).toBe('admin-123')
  })

  it('should REJECT a regular user', async () => {
    mocks.verifyIdTokenMock.mockResolvedValue({
      uid: 'user-123',
      email: 'user@example.com',
      role: 'USER',
    })

    const result = await verifySession('user-token')
    expect(result).toBeNull()
  })
})
