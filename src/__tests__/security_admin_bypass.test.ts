import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { verifySession } from '../lib/firebase-admin'

// Mock firebase-admin to prevent initialization errors
vi.mock('firebase-admin', () => {
  return {
    default: {
      apps: [],
      initializeApp: vi.fn(),
      credential: {
        cert: vi.fn(),
      },
      auth: () => ({
        verifyIdToken: vi.fn(),
      }),
      firestore: () => ({}),
    },
  }
})

describe('Security: Admin Bypass', () => {
  const MOCK_TOKEN = 'mock-token-secret-123'

  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should allow mock token in development environment', async () => {
    // Simulate development environment
    vi.stubEnv('NODE_ENV', 'development')

    // We need to re-import the module to pick up the env change if it was cached,
    // but verifying session logic checks the token dynamically.
    // However, if the logic uses process.env at module scope, we'd need to reset modules.
    // The proposed fix uses process.env inside the function, so it should be fine.

    const session = await verifySession(MOCK_TOKEN)

    expect(session).not.toBeNull()
    expect(session?.email).toBe('mock@smartmotor.ae')
    expect(session?.role).toBe('ADMIN')
  })

  it('should REJECT mock token in production environment', async () => {
    // Simulate production environment
    vi.stubEnv('NODE_ENV', 'production')

    const session = await verifySession(MOCK_TOKEN)

    // In the current vulnerable state, this will FAIL (it returns session)
    // After fix, it should PASS (returns null)
    expect(session).toBeNull()
  })
})
