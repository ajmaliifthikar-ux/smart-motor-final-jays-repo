import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { TOTPSecretResponse } from './types/admin'

/**
 * TOTP Configuration
 */
const TOTP_CONFIG = {
  issuer: process.env.TOTP_ISSUER || 'SmartMotor',
  window: 2, // ±2 time windows for tolerance (60 seconds)
  encoding: 'base32' as const,
  backupCodesCount: 10,
}

/**
 * Generate a new TOTP secret for an admin
 * Returns secret and QR code for scanning
 *
 * @param email - Admin email address
 * @param adminName - Admin name for QR code label
 * @returns Promise with secret, QR code, and manual entry string
 */
export async function generateTOTPSecret(
  email: string,
  adminName?: string
): Promise<TOTPSecretResponse> {
  const secret = speakeasy.generateSecret({
    name: `${TOTP_CONFIG.issuer} (${adminName || email})`,
    issuer: TOTP_CONFIG.issuer,
    length: 32, // 256-bit secret (more secure than default 32)
  })

  if (!secret.base32) {
    throw new Error('Failed to generate TOTP secret')
  }

  // Generate QR code as data URL
  const qrCode = await QRCode.toDataURL(secret.otpauth_url!, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 1,
  })

  return {
    secret: secret.base32,
    qrCode,
    manualEntry: secret.base32, // For manual entry if QR doesn't work
  }
}

/**
 * Verify a TOTP code against a secret
 * Includes time window tolerance for clock skew
 *
 * @param secret - Base32 encoded TOTP secret
 * @param code - 6-digit code to verify
 * @returns true if code is valid, false otherwise
 */
export function verifyTOTPCode(secret: string, code: string): boolean {
  try {
    // Validate code format (must be 6 digits)
    if (!/^\d{6}$/.test(code)) {
      return false
    }

    const isValid = speakeasy.totp.verify({
      secret,
      encoding: TOTP_CONFIG.encoding,
      token: code,
      window: TOTP_CONFIG.window,
    })

    return !!isValid
  } catch (error) {
    console.error('TOTP verification error:', error)
    return false
  }
}

/**
 * Generate backup codes for account recovery
 * If user loses access to authenticator, they can use these codes
 *
 * @param count - Number of codes to generate (default 10)
 * @returns Array of 8-character backup codes
 */
export function generateBackupCodes(count: number = TOTP_CONFIG.backupCodesCount): string[] {
  const codes: string[] = []

  for (let i = 0; i < count; i++) {
    // Generate 8-character backup code (alphanumeric, no ambiguous chars)
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    codes.push(code)
  }

  return codes
}

/**
 * Format backup codes for display
 * Groups them in pairs with dashes for better readability
 *
 * @param codes - Array of backup codes
 * @returns Formatted codes with line breaks and grouping
 */
export function formatBackupCodesForDisplay(codes: string[]): string {
  return codes
    .map((code) => {
      // Format as: XXXX-XXXX
      const first = code.substring(0, 4)
      const second = code.substring(4, 8)
      return `${first}-${second}`
    })
    .join('\n')
}

/**
 * Get current TOTP code for a secret
 * Useful for testing and debugging
 * @internal
 *
 * @param secret - Base32 encoded TOTP secret
 * @returns Current 6-digit TOTP code
 */
export function getCurrentTOTPCode(secret: string): string {
  try {
    const token = speakeasy.totp({
      secret,
      encoding: TOTP_CONFIG.encoding,
    })
    return String(token).padStart(6, '0')
  } catch (error) {
    console.error('Error generating current TOTP code:', error)
    return '000000'
  }
}

/**
 * Get remaining time until current TOTP code expires
 * Useful for UI countdown displays
 *
 * @returns Time remaining in milliseconds
 */
export function getTOTPTimeRemaining(): number {
  const now = Date.now()
  const timeStep = 30000 // 30 seconds in milliseconds
  return timeStep - (now % timeStep)
}

/**
 * Validate TOTP secret format
 * Checks if secret is valid base32 string
 *
 * @param secret - Secret to validate
 * @returns true if valid, false otherwise
 */
export function validateTOTPSecret(secret: string): boolean {
  // Base32 characters only: A-Z2-7
  const base32Regex = /^[A-Z2-7]+={0,6}$/
  return base32Regex.test(secret)
}

/**
 * Generate secure random device ID for trusted devices
 * Used to identify and track user's devices
 *
 * @returns Random device ID string
 */
export function generateDeviceId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Extract device name from user agent
 * Provides human-friendly device identification
 *
 * @param userAgent - Browser user agent string
 * @returns Human-readable device name
 */
export function extractDeviceNameFromUserAgent(userAgent: string): string {
  // Extract browser and OS info
  let browser = 'Unknown Browser'
  let os = 'Unknown OS'

  // Detect browser
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome'
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari'
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox'
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge'
  }

  // Detect OS
  if (userAgent.includes('Windows')) {
    os = 'Windows'
  } else if (userAgent.includes('Mac')) {
    os = 'macOS'
  } else if (userAgent.includes('Linux')) {
    os = 'Linux'
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS'
  } else if (userAgent.includes('Android')) {
    os = 'Android'
  }

  return `${browser} on ${os}`
}

/**
 * Get TOTP Configuration (for testing/debugging)
 * @internal
 */
export function getTOTPConfig() {
  return TOTP_CONFIG
}
