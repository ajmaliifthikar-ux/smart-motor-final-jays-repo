import { describe, it, expect, vi } from 'vitest';
import { verifySession } from '../lib/firebase-admin';

// Mock firebase-admin
vi.mock('firebase-admin', () => {
    return {
        default: {
            auth: () => ({
                verifyIdToken: vi.fn(async (token) => {
                    if (token === 'admin-email-token') {
                        return { email: 'admin@smartmotor.ae', role: 'USER' };
                    }
                    if (token === 'dev-email-token') {
                        return { email: 'dev@smartmotor.ae', role: 'USER' };
                    }
                    if (token === 'wildcard-email-token') {
                        return { email: 'hacker@smartmotor.ae', role: 'USER' };
                    }
                    if (token === 'valid-admin-token') {
                        return { email: 'realadmin@example.com', role: 'ADMIN' };
                    }
                    if (token === 'regular-user-token') {
                        return { email: 'user@example.com', role: 'USER' };
                    }
                    throw new Error('Invalid token');
                }),
            }),
            apps: ['test-app'], // Skip initialization logic
            app: () => ({}),
            initializeApp: vi.fn(),
            credential: {
                cert: vi.fn(),
            },
        },
    };
});

// Mock getFirestore separately as it's imported directly
vi.mock('firebase-admin/firestore', () => ({
    getFirestore: vi.fn(() => ({
        collection: vi.fn(),
    })),
}));

describe('Auth Security Verification', () => {
    it('SECURE: verifySession DENIES admin@smartmotor.ae without ADMIN role', async () => {
        const result = await verifySession('admin-email-token');
        expect(result).toBeNull();
    });

    it('SECURE: verifySession DENIES dev@smartmotor.ae without ADMIN role', async () => {
        const result = await verifySession('dev-email-token');
        expect(result).toBeNull();
    });

    it('SECURE: verifySession DENIES any @smartmotor.ae email without ADMIN role', async () => {
        const result = await verifySession('wildcard-email-token');
        expect(result).toBeNull();
    });

    it('verifySession ALLOWS legitimate ADMIN role', async () => {
        const result = await verifySession('valid-admin-token');
        expect(result).not.toBeNull();
        expect(result?.role).toBe('ADMIN');
    });

    it('verifySession DENIES regular user', async () => {
        const result = await verifySession('regular-user-token');
        expect(result).toBeNull();
    });
});
