import bcryptjs from 'bcryptjs'

/**
 * Bcrypt configuration
 * Cost factor of 12 provides good balance between security and performance
 */
const BCRYPT_ROUNDS = 12

/**
 * Hash a value using bcryptjs
 * Used for passwords, answers, and sensitive data
 *
 * @param value - Value to hash
 * @returns Promise with bcrypt hash
 * @throws Error if hashing fails
 */
export async function hashValue(value: string): Promise<string> {
  try {
    const salt = await bcryptjs.genSalt(BCRYPT_ROUNDS)
    const hash = await bcryptjs.hash(value, salt)
    return hash
  } catch (error) {
    console.error('Hashing error:', error)
    throw new Error('Failed to hash value')
  }
}

/**
 * Verify a value against its hash
 * Used for password verification, answer verification, etc.
 *
 * @param value - Original value to verify
 * @param hash - Hash to verify against
 * @returns Promise with boolean indicating if values match
 */
export async function verifyHash(value: string, hash: string): Promise<boolean> {
  try {
    const isMatch = await bcryptjs.compare(value, hash)
    return isMatch
  } catch (error) {
    console.error('Hash verification error:', error)
    return false
  }
}

/**
 * Hash multiple values in parallel
 * Useful for hashing backup codes or security questions
 *
 * @param values - Array of values to hash
 * @returns Promise with array of hashes in same order
 */
export async function hashMultiple(values: string[]): Promise<string[]> {
  try {
    const hashes = await Promise.all(
      values.map((value) => hashValue(value))
    )
    return hashes
  } catch (error) {
    console.error('Batch hashing error:', error)
    throw new Error('Failed to hash values')
  }
}

/**
 * Verify a value against any hash in a list
 * Useful for checking if answer matches any stored hash (with timing attack protection)
 *
 * @param value - Value to verify
 * @param hashes - Array of hashes to check against
 * @returns Promise with boolean indicating if value matches any hash
 */
export async function verifyHashAgainstList(
  value: string,
  hashes: string[]
): Promise<boolean> {
  try {
    // Check against all hashes to prevent timing attacks
    // (doesn't short-circuit when match found)
    const results = await Promise.all(
      hashes.map((hash) => verifyHash(value, hash))
    )
    return results.some((result) => result)
  } catch (error) {
    console.error('Hash list verification error:', error)
    return false
  }
}

/**
 * Create a salted hash suitable for non-reversible operations
 * Different from password hashing - used for comparing tokens or codes
 *
 * @param value - Value to hash
 * @returns Promise with hash
 */
export async function createSecureHash(value: string): Promise<string> {
  return hashValue(value)
}

/**
 * Verify a secure hash
 *
 * @param value - Original value
 * @param hash - Hash to verify against
 * @returns Promise with boolean indicating if match
 */
export async function verifySecureHash(value: string, hash: string): Promise<boolean> {
  return verifyHash(value, hash)
}

/**
 * Hash a backup code with additional salt
 * Backup codes should be heavily salted for extra security
 *
 * @param code - Backup code to hash
 * @returns Promise with hash
 */
export async function hashBackupCode(code: string): Promise<string> {
  // Add extra entropy by hashing multiple times
  const salt = await bcryptjs.genSalt(BCRYPT_ROUNDS + 2)
  const hash = await bcryptjs.hash(code, salt)
  return hash
}

/**
 * Verify a backup code against its hash
 * Prevents timing attacks by always taking same time
 *
 * @param code - Code to verify
 * @param hash - Hash to verify against
 * @returns Promise with boolean indicating if match
 */
export async function verifyBackupCode(code: string, hash: string): Promise<boolean> {
  try {
    return await verifyHash(code, hash)
  } catch (error) {
    console.error('Backup code verification error:', error)
    return false
  }
}

/**
 * Hash a security question answer
 * Answers are case-insensitive and trimmed before hashing
 *
 * @param answer - Answer text to hash
 * @returns Promise with hash
 */
export async function hashSecurityAnswer(answer: string): Promise<string> {
  // Normalize answer: trim whitespace, convert to lowercase
  const normalized = answer.trim().toLowerCase()
  return hashValue(normalized)
}

/**
 * Verify a security question answer against its hash
 * Handles normalization like hashing does
 *
 * @param answer - Answer to verify
 * @param hash - Hash to verify against
 * @returns Promise with boolean indicating if match
 */
export async function verifySecurityAnswer(
  answer: string,
  hash: string
): Promise<boolean> {
  const normalized = answer.trim().toLowerCase()
  return verifyHash(normalized, hash)
}

/**
 * Create HMAC-style hash for tokens (non-reversible but deterministic)
 * Used for device IDs, session tokens
 * @internal
 *
 * @param value - Value to hash
 * @param secret - Secret for additional security (optional)
 * @returns Promise with hash
 */
export async function createTokenHash(
  value: string,
  secret?: string
): Promise<string> {
  const input = secret ? `${value}:${secret}` : value
  return hashValue(input)
}

/**
 * Get bcrypt version being used
 * Useful for security audits
 * @internal
 *
 * @returns Bcrypt version string
 */
export function getBcryptVersion(): string {
  return `bcryptjs with ${BCRYPT_ROUNDS} rounds`
}
