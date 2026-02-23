import { describe, it, expect, vi, beforeEach } from 'vitest'

// Use vi.hoisted to ensure the mock is available before imports
const { verifyIdTokenMock } = vi.hoisted(() => {
  return { verifyIdTokenMock: vi.fn() }
})

// Mock firebase-admin
vi.mock('firebase-admin', () => {
  return {
    default: {
      apps: [], // Simulate no apps initialized to trigger init logic or just bypass
      credential: {
        cert: vi.fn(),
      },
      initializeApp: vi.fn(),
      auth: vi.fn(() => ({
        verifyIdToken: verifyIdTokenMock,
        getUserByEmail: vi.fn(),
      })),
      firestore: vi.fn(() => ({})),
      app: vi.fn(() => ({})),
    }
  }
})

// Mock firebase-admin/firestore
vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}))

import { verifySession } from '../../src/lib/firebase-admin'

describe('Security: Admin Access Control', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should deny access to users with @smartmotor.ae email but without ADMIN role', async () => {
    // This test confirms the VULNERABILITY IS FIXED
    const mockToken = {
      uid: 'hacker-uid',
      email: 'hacker@smartmotor.ae',
      // No role
    };

    verifyIdTokenMock.mockResolvedValue(mockToken);

    const session = await verifySession('some-token');

    // Expectation: Access DENIED
    expect(session).toBeNull();
  });

  it('should allow access to the specific admin email (fallback)', async () => {
    const mockToken = {
      uid: 'admin-uid',
      email: 'admin@smartmotor.ae',
      role: 'USER', // Even without role, email allows access as fallback
    };

    verifyIdTokenMock.mockResolvedValue(mockToken);

    const session = await verifySession('some-token');
    expect(session).not.toBeNull();
    expect(session?.email).toBe('admin@smartmotor.ae');
  });

  it('should allow access to users with ADMIN role', async () => {
    const mockToken = {
      uid: 'admin-uid',
      email: 'external-admin@example.com',
      role: 'ADMIN',
    };

    verifyIdTokenMock.mockResolvedValue(mockToken);

    const session = await verifySession('some-token');
    expect(session).not.toBeNull();
  });

  it('should deny access to random users without admin role', async () => {
    const mockToken = {
      uid: 'user-uid',
      email: 'random@example.com',
      role: 'USER',
    };

    verifyIdTokenMock.mockResolvedValue(mockToken);

    const session = await verifySession('some-token');
    expect(session).toBeNull();
  });
});
