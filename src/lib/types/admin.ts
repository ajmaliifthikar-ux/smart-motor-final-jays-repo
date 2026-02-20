import { Timestamp } from 'firebase-admin/firestore'

/**
 * Two-Factor Authentication (2FA) Configuration
 * Stores TOTP settings and backup codes for admin accounts
 */
export interface TwoFactorConfig {
  enabled: boolean
  method: 'authenticator' // Future: 'sms', 'email'
  secret?: string // TOTP secret (base32 encoded, stored encrypted)
  verified: boolean // Whether 2FA has been verified at least once
  backupCodesCount: number // Number of unused backup codes remaining
  backupCodes?: string[] // Hashed backup codes (never store plaintext)
  lastVerified?: Timestamp // Last successful 2FA verification
  lastUsedCode?: string // Last used backup code (prevent replay)
  lastUsedTime?: Timestamp // Timestamp of last code usage
}

/**
 * Security Settings for Admin Accounts
 * Comprehensive security configuration and history
 */
export interface SecuritySettings {
  passwordHash?: string // Historical password hash for enforcing password history
  passwordChangedAt: Timestamp // Last password change timestamp
  passwordExpiryDays?: number // Days until password expires (optional enforcement)
  passwordHistory?: Array<{
    hash: string
    changedAt: Timestamp
  }> // Last 3 passwords to prevent reuse

  securityQuestions?: Array<{
    questionId: string // ID of security question
    answerHash: string // Hash of answer (never store plaintext)
  }> // 3 security questions for recovery

  loginAttempts?: number // Failed login attempts (for rate limiting)
  lastFailedLoginAt?: Timestamp // Last failed login attempt
  lastLoginAt?: Timestamp // Last successful login
  lastPasswordChangeAt?: Timestamp // Last password change

  trustedDevices?: Array<{
    deviceId: string // Unique device identifier
    deviceName: string // User-friendly name (e.g., "Chrome on MacBook")
    ipAddress: string // IP address when device was added
    userAgent: string // Browser/device user agent
    lastUsedAt: Timestamp // Last time device was used
    createdAt: Timestamp // When device was trusted
  }>

  sessionTokens?: Array<{
    token: string // Hashed session token (never store plaintext)
    deviceId: string // Associated device
    ipAddress: string // IP address of session
    userAgent: string // Browser user agent
    expiresAt: Timestamp // Session expiration
    createdAt: Timestamp // Session creation time
  }> // Active session tokens
}

/**
 * Admin Invitation for new admin account creation
 * Allows secure onboarding of new admins via email links
 */
export interface AdminInvitation {
  id: string
  email: string
  token: string // Hashed token (original sent via email)
  tokenHash: string // Double-hashed for additional security
  expiresAt: Timestamp // Invitation expiration (24 hours)
  createdBy: string // Admin ID who sent invitation
  createdAt: Timestamp
  usedAt?: Timestamp // When invitation was used
  usedBy?: string // Admin ID who used it
  requiresTwoFactor: boolean // Whether new admin must enable 2FA
  status: 'pending' | 'accepted' | 'expired' | 'revoked'
}

/**
 * Security Audit Log Entry
 * Tracks all security-related events for admin accounts
 */
export interface SecurityAuditLog {
  id: string
  adminId: string // Admin who triggered event (or system)
  event:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'LOGIN_ATTEMPT_LOCKOUT'
    | '2FA_ENABLED'
    | '2FA_DISABLED'
    | '2FA_VERIFIED'
    | '2FA_FAILED'
    | 'PASSWORD_CHANGED'
    | 'PASSWORD_RESET_REQUESTED'
    | 'SECURITY_QUESTIONS_UPDATED'
    | 'DEVICE_ADDED'
    | 'DEVICE_REMOVED'
    | 'SESSION_CREATED'
    | 'SESSION_REVOKED'
    | 'SESSION_EXPIRED'
    | 'BACKUP_CODES_GENERATED'
    | 'BACKUP_CODE_USED'
    | 'INVITATION_SENT'
    | 'INVITATION_ACCEPTED'
    | 'ACCOUNT_LOCKED'
    | 'ACCOUNT_UNLOCKED'
    | 'SUSPICIOUS_ACTIVITY'
    | 'ADMIN_CREATED'
    | 'ADMIN_DELETED'

  details: {
    [key: string]: any
  } // Event-specific details

  ipAddress: string // IP address of request
  userAgent: string // Browser/device info
  status: 'SUCCESS' | 'FAILED'
  timestamp: Timestamp
  description?: string // Human-readable description
}

/**
 * Extended Admin User (includes 2FA and security settings)
 * Combines base user info with security extensions
 */
export interface AdminUser {
  id: string
  email: string
  name?: string
  role: 'ADMIN' | 'SUPER_ADMIN' // Added SUPER_ADMIN role
  image?: string
  phone?: string

  // Security fields
  twoFactor?: TwoFactorConfig
  security?: SecuritySettings

  // Admin-specific fields
  isActive: boolean // Can be deactivated without deletion
  requiresTwoFactor: boolean // Enforce 2FA for this admin
  lastAuditedAt?: Timestamp

  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
  deletedAt?: Timestamp | null
  createdBy?: string // Admin ID who created this admin
}

/**
 * Password validation result
 * Used for password strength checking
 */
export interface PasswordValidation {
  valid: boolean
  strength: 'weak' | 'fair' | 'good' | 'strong'
  score: number // 0-100
  requirements: Array<{
    met: boolean
    text: string
    priority: 'required' | 'recommended'
  }>
  feedback: string
}

/**
 * TOTP Secret Response
 * Returned when generating new TOTP secret
 */
export interface TOTPSecretResponse {
  secret: string // Base32 encoded secret
  qrCode: string // Data URL for QR code (base64)
  manualEntry: string // Manual entry format for backup
}

/**
 * Admin Session with device info
 */
export interface AdminSession {
  uid: string
  email: string
  name?: string
  role: string
  createdAt: number // Unix timestamp
  expiresAt: number // Unix timestamp
  deviceId?: string
  ipAddress?: string
}

export type { Timestamp }
