
import { describe, it, expect, vi, afterEach } from 'vitest';
import { verifySession } from './firebase-admin';

// Mock firebase-admin to avoid initialization errors and network calls
vi.mock('firebase-admin', () => {
  return {
    default: {
      apps: [],
      initializeApp: vi.fn(),
      app: vi.fn(),
      credential: {
        cert: vi.fn(),
      },
      auth: () => ({
        verifyIdToken: vi.fn(),
      }),
      firestore: () => ({}),
    },
  };
});

describe('verifySession Security', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('should REJECT mock token in PRODUCTION environment', async () => {
    // Simulate production environment
    process.env = { ...originalEnv, NODE_ENV: 'production' };

    const token = 'mock-token-secret-123';
    const session = await verifySession(token);

    // Should return null (or fail validation if it proceeds to real verify)
    // In our mock, real verify returns undefined and throws, caught by try/catch -> null
    expect(session).toBeNull();
  });

  it('should ALLOW mock token in DEVELOPMENT environment', async () => {
    // Simulate development environment
    process.env = { ...originalEnv, NODE_ENV: 'development' };

    const token = 'mock-token-secret-123';
    const session = await verifySession(token);

    expect(session).not.toBeNull();
    expect(session?.uid).toBe('mock-admin-user');
  });
});
