import { PasswordValidation } from './types/admin'

/**
 * Password requirements configuration
 */
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
}

/**
 * Common passwords to reject (simplified list)
 * In production, use a comprehensive list or external service
 */
const WEAK_PASSWORDS = [
  'password',
  '12345678',
  'qwerty',
  'abc123',
  'admin123',
  'smartmotor',
  'dubai',
  'uae',
]

/**
 * Validate password strength and requirements
 * Returns comprehensive validation result with feedback
 *
 * @param password - Password to validate
 * @returns PasswordValidation object with details
 */
export function validatePassword(password: string): PasswordValidation {
  const requirements: PasswordValidation['requirements'] = []
  let score = 0

  // Check length (most important)
  const lengthMet = password.length >= PASSWORD_REQUIREMENTS.minLength
  requirements.push({
    met: lengthMet,
    text: `At least ${PASSWORD_REQUIREMENTS.minLength} characters`,
    priority: 'required',
  })
  if (lengthMet) {
    score += 20
    // Extra points for longer passwords
    if (password.length >= 12) score += 5
    if (password.length >= 16) score += 5
  }

  // Check uppercase
  const uppercaseMet =
    PASSWORD_REQUIREMENTS.requireUppercase && /[A-Z]/.test(password)
  requirements.push({
    met: uppercaseMet,
    text: 'At least one uppercase letter (A-Z)',
    priority: 'required',
  })
  if (uppercaseMet) score += 20

  // Check lowercase
  const lowercaseMet =
    PASSWORD_REQUIREMENTS.requireLowercase && /[a-z]/.test(password)
  requirements.push({
    met: lowercaseMet,
    text: 'At least one lowercase letter (a-z)',
    priority: 'required',
  })
  if (lowercaseMet) score += 20

  // Check numbers
  const numbersMet =
    PASSWORD_REQUIREMENTS.requireNumbers && /[0-9]/.test(password)
  requirements.push({
    met: numbersMet,
    text: 'At least one number (0-9)',
    priority: 'required',
  })
  if (numbersMet) score += 15

  // Check special characters
  const specialCharsMet =
    PASSWORD_REQUIREMENTS.requireSpecialChars &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  requirements.push({
    met: specialCharsMet,
    text: 'At least one special character (!@#$%^&*...)',
    priority: 'required',
  })
  if (specialCharsMet) score += 15

  // Check for common patterns
  const hasSequentialNumbers = /\d{3,}/.test(password) // 3+ consecutive numbers
  const hasSequentialLetters = /[a-z]{5,}/i.test(password) // 5+ consecutive letters
  const hasRepeatingChars = /(.)\1{2,}/.test(password) // 3+ same character

  if (hasSequentialNumbers) score -= 5
  if (hasSequentialLetters) score -= 5
  if (hasRepeatingChars) score -= 5

  // Check if password is in weak password list
  const isCommonPassword = WEAK_PASSWORDS.some((wp) =>
    password.toLowerCase().includes(wp.toLowerCase())
  )
  if (isCommonPassword) score -= 10

  // Determine strength
  let strength: PasswordValidation['strength'] = 'weak'
  if (score >= 80) {
    strength = 'strong'
  } else if (score >= 60) {
    strength = 'good'
  } else if (score >= 40) {
    strength = 'fair'
  }

  // Generate feedback
  let feedback = ''
  const allMet = requirements.every((r) => r.met)

  if (!allMet) {
    const missing = requirements.filter((r) => !r.met && r.priority === 'required')
    feedback = `Missing: ${missing.map((m) => m.text).join(', ')}`
  } else if (strength === 'strong') {
    feedback = 'Excellent password! Very secure.'
  } else if (strength === 'good') {
    feedback = 'Good password. Consider adding more variety.'
  } else if (strength === 'fair') {
    feedback = 'Password is acceptable but could be stronger.'
  } else {
    feedback = 'Password is too weak. Please strengthen it.'
  }

  return {
    valid: allMet,
    strength,
    score: Math.max(0, Math.min(100, score)),
    requirements,
    feedback,
  }
}

/**
 * Check if password meets minimum requirements
 * Quick check without detailed feedback
 *
 * @param password - Password to check
 * @returns true if password meets requirements, false otherwise
 */
export function meetsPasswordRequirements(password: string): boolean {
  if (password.length < PASSWORD_REQUIREMENTS.minLength) return false
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password))
    return false
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password))
    return false
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/[0-9]/.test(password))
    return false
  if (
    PASSWORD_REQUIREMENTS.requireSpecialChars &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  )
    return false
  return true
}

/**
 * Get password requirements for display
 * Returns formatted text for UI display
 *
 * @returns Array of requirement strings
 */
export function getPasswordRequirements(): string[] {
  return [
    `Minimum ${PASSWORD_REQUIREMENTS.minLength} characters`,
    'At least one uppercase letter',
    'At least one lowercase letter',
    'At least one number',
    'At least one special character',
  ]
}

/**
 * Estimate password strength visually
 * Returns color and percentage for progress bar
 *
 * @param password - Password to evaluate
 * @returns Object with color class and percentage
 */
export function getPasswordStrengthIndicator(password: string): {
  color: 'red' | 'orange' | 'yellow' | 'green'
  percentage: number
  label: string
} {
  const validation = validatePassword(password)

  if (!validation.valid) {
    return {
      color: 'red',
      percentage: Math.min(validation.score / 2, 20),
      label: 'Invalid',
    }
  }

  if (validation.strength === 'strong') {
    return { color: 'green', percentage: 100, label: 'Strong' }
  } else if (validation.strength === 'good') {
    return { color: 'yellow', percentage: 75, label: 'Good' }
  } else if (validation.strength === 'fair') {
    return { color: 'orange', percentage: 50, label: 'Fair' }
  }

  return { color: 'red', percentage: 25, label: 'Weak' }
}

/**
 * Get Tailwind CSS classes for password strength color
 *
 * @param strength - Password strength level
 * @returns Tailwind CSS class string
 */
export function getPasswordStrengthClasses(
  strength: PasswordValidation['strength']
): string {
  switch (strength) {
    case 'strong':
      return 'bg-green-500'
    case 'good':
      return 'bg-yellow-500'
    case 'fair':
      return 'bg-orange-500'
    case 'weak':
      return 'bg-red-500'
    default:
      return 'bg-gray-300'
  }
}

/**
 * Generate a random password meeting requirements
 * Useful for admin-generated temporary passwords
 * @internal
 *
 * @returns Random password string
 */
export function generateRandomPassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const special = '!@#$%^&*()_+-=[]{}|,.<>?'

  let password = ''

  // Ensure all character types are included
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length))
  password += numbers.charAt(Math.floor(Math.random() * numbers.length))
  password += special.charAt(Math.floor(Math.random() * special.length))

  // Fill rest with random characters from all types
  const allChars = uppercase + lowercase + numbers + special
  for (let i = password.length; i < 12; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }

  // Shuffle password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}
