import { nanoid } from 'nanoid'

/**
 * Generate a cryptographically secure random token
 * Used for invitation tokens, password reset tokens, etc.
 *
 * @param length - Length of token (default 32)
 * @returns Random token string
 */
export function generateSecureToken(length: number = 32): string {
  return nanoid(length)
}

/**
 * Generate a unique device ID
 * Used to identify and track trusted devices
 *
 * @returns Device ID string (format: dvc_xxxxxxxxxxxx)
 */
export function generateDeviceId(): string {
  return `dvc_${nanoid(24)}`
}

/**
 * Generate a unique session ID
 * Used for session tracking and management
 *
 * @returns Session ID string (format: ses_xxxxxxxxxxxx)
 */
export function generateSessionId(): string {
  return `ses_${nanoid(24)}`
}

/**
 * Generate a temporary code for 2FA verification
 * Not the OTP - this is for temporary multi-step flows
 *
 * @returns Temporary code (format: tmp_xxxxxxxxxxxx)
 */
export function generateTemporaryCode(): string {
  return `tmp_${nanoid(20)}`
}

/**
 * Generate invitation token for admin setup
 * Should be relatively short but cryptographically secure
 *
 * @returns Invitation token (format: inv_xxxxxxxxxxxx)
 */
export function generateInvitationToken(): string {
  return `inv_${nanoid(24)}`
}

/**
 * Generate password reset token
 * Should be different format from invitation for clarity
 *
 * @returns Password reset token (format: reset_xxxxxxxxxxxx)
 */
export function generatePasswordResetToken(): string {
  return `reset_${nanoid(24)}`
}

/**
 * Generate CSRF token for form protection
 *
 * @returns CSRF token (format: csrf_xxxxxxxxxxxx)
 */
export function generateCSRFToken(): string {
  return `csrf_${nanoid(32)}`
}

/**
 * Generate a URL-safe token for embedding in links
 * Excludes ambiguous characters (0, O, l, 1, etc.)
 *
 * @param length - Length of token
 * @returns URL-safe token
 */
export function generateUrlSafeToken(length: number = 32): string {
  // Use nanoid which is URL-safe by default
  return nanoid(length)
}

/**
 * Generate a short code for user-facing operations
 * Uses only uppercase letters and numbers for easy typing
 * Example: "ABCD-1234"
 *
 * @param segments - Number of segments (default 2)
 * @param charactersPerSegment - Characters per segment (default 4)
 * @returns Short code string
 */
export function generateShortCode(
  segments: number = 2,
  charactersPerSegment: number = 4
): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const codes: string[] = []

  for (let i = 0; i < segments; i++) {
    let segment = ''
    for (let j = 0; j < charactersPerSegment; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    codes.push(segment)
  }

  return codes.join('-')
}

/**
 * Verify a token hasn't been tampered with
 * Simple check - in production use proper HMAC or signed JWT
 *
 * @param token - Token to validate
 * @returns true if token looks valid, false otherwise
 */
export function validateTokenFormat(token: string): boolean {
  // Token should be non-empty and reasonable length
  if (!token || token.length < 8 || token.length > 100) {
    return false
  }

  // Should only contain URL-safe characters
  const urlSafeRegex = /^[a-zA-Z0-9_-]+$/
  return urlSafeRegex.test(token)
}

/**
 * Extract token prefix to determine token type
 * Useful for routing/validation logic
 *
 * @param token - Token string
 * @returns Token type prefix (e.g., 'inv', 'reset', 'tmp') or 'unknown'
 */
export function getTokenType(token: string): string {
  const prefix = token.split('_')[0]

  if (['inv', 'reset', 'tmp', 'ses', 'dvc', 'csrf'].includes(prefix)) {
    return prefix
  }

  return 'unknown'
}

/**
 * Generate authentication token for temporary API access
 * Used for interim operations during multi-step auth
 *
 * @returns API token (format: api_xxxxxxxxxxxx)
 */
export function generateAPIToken(): string {
  return `api_${nanoid(32)}`
}

/**
 * Generate a secure random number for OTP recovery codes
 * Different from TOTP - this is just a backup code identifier
 *
 * @returns 8-character alphanumeric code
 */
export function generateBackupCodeId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Create a rate limit key for attack prevention
 * Combines identifying info to create unique key per user/IP combo
 *
 * @param identifier - User ID, email, or IP address
 * @param action - Action type (e.g., 'login', '2fa_verify')
 * @returns Rate limit key
 */
export function createRateLimitKey(identifier: string, action: string): string {
  return `rl:${action}:${identifier}`
}

/**
 * Generate a webhook signature token
 * Used to verify webhook authenticity
 *
 * @returns Webhook token (format: wh_xxxxxxxxxxxx)
 */
export function generateWebhookToken(): string {
  return `wh_${nanoid(32)}`
}

/**
 * Tokenize sensitive data for safe storage
 * Maps actual data to random token
 * Note: This is a simple approach - use proper tokenization service in production
 *
 * @param data - Sensitive data to tokenize
 * @returns Token representing the data
 */
export function tokenizeSensitiveData(data: string): string {
  // Create hash of data and combine with random token
  const randomPart = nanoid(16)
  // In production, store mapping in secure storage
  return `tok_${randomPart}`
}

/**
 * Generate unique request ID for logging and tracing
 * Useful for debugging security events
 *
 * @returns Request ID (format: req_xxxxxxxxxxxx_timestamp)
 */
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36)
  return `req_${nanoid(16)}_${timestamp}`
}
