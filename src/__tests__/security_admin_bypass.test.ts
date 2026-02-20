
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebase-admin
vi.mock('firebase-admin', () => {
  return {
    default: {
      apps: [],
      initializeApp: vi.fn(),
      credential: {
        cert: vi.fn(),
      },
      auth: vi.fn(() => ({
        verifyIdToken: vi.fn(),
      })),
      app: vi.fn(),
    },
    credential: {
        cert: vi.fn(),
    }
  };
});

// Mock firebase-admin/firestore
vi.mock('firebase-admin/firestore', () => {
  return {
    getFirestore: vi.fn(() => ({
      collection: vi.fn(),
    })),
  };
});

// Import the function to test
// We need to use `import` after mock to ensure the mock is applied
import { verifySession, adminAuth } from '@/lib/firebase-admin';

describe('verifySession Security Check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access for user with ADMIN role', async () => {
    // Setup mock
    (adminAuth.verifyIdToken as any).mockResolvedValue({
      uid: 'admin-user',
      email: 'admin@example.com',
      role: 'ADMIN',
    });

    const result = await verifySession('valid-token');
    expect(result).not.toBeNull();
    expect(result?.email).toBe('admin@example.com');
  });

  it('should DENY access for user without ADMIN role and non-whitelisted email', async () => {
    (adminAuth.verifyIdToken as any).mockResolvedValue({
      uid: 'regular-user',
      email: 'user@example.com',
      role: 'USER',
    });

    const result = await verifySession('valid-token');
    expect(result).toBeNull();
  });

  it('should DENY access for random @smartmotor.ae email (VULNERABILITY FIXED)', async () => {
    (adminAuth.verifyIdToken as any).mockResolvedValue({
      uid: 'random-employee',
      email: 'random.employee@smartmotor.ae',
      role: 'USER', // No admin role!
    });

    const result = await verifySession('valid-token');
    expect(result).toBeNull();
  });

  it('should ALLOW access for admin@smartmotor.ae as fallback (with warning)', async () => {
    (adminAuth.verifyIdToken as any).mockResolvedValue({
      uid: 'admin-legacy',
      email: 'admin@smartmotor.ae',
      role: 'USER', // No admin role claim yet
    });

    const result = await verifySession('valid-token');
    expect(result).not.toBeNull();
    expect(result?.email).toBe('admin@smartmotor.ae');
  });

  it('should DENY access for dev@smartmotor.ae (removed from whitelist)', async () => {
    (adminAuth.verifyIdToken as any).mockResolvedValue({
      uid: 'dev-user',
      email: 'dev@smartmotor.ae',
      role: 'USER',
    });

    const result = await verifySession('valid-token');
    expect(result).toBeNull();
  });
});
