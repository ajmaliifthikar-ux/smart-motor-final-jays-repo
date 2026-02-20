import { nanoid } from 'nanoid'
import { hashValue, verifyHash } from './hashing'

/**
 * Admin invitation token generation and verification
 */
export async function generateInvitationWithHash(email: string): Promise<{
  token: string
  tokenHash: string
}> {
  const token = `inv_${nanoid(24)}`
  const tokenHash = await hashValue(token)
  return { token, tokenHash }
}

/**
 * Verify invitation token against stored hash
 */
export async function verifyInvitationToken(
  token: string,
  tokenHash: string
): Promise<boolean> {
  return verifyHash(token, tokenHash)
}

/**
 * Check if invitation has expired
 */
export function isInvitationExpired(expiresAt: Date): boolean {
  return expiresAt < new Date()
}

/**
 * Calculate invitation expiry time (24 hours from now)
 */
export function getInvitationExpiryTime(): Date {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)
  return expiresAt
}

/**
 * Format invitation token for display in email
 */
export function formatInvitationUrl(baseUrl: string, token: string): string {
  return `${baseUrl}/admin/setup/${token}`
}

/**
 * Generate admin setup link for email
 */
export function generateSetupLink(baseUrl: string, adminEmail: string, token: string): {
  link: string
  expiryHours: number
} {
  return {
    link: formatInvitationUrl(baseUrl, token),
    expiryHours: 24,
  }
}
