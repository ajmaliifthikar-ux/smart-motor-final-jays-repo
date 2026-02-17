/**
 * Phonetic Alphabet Library
 * NATO phonetic code for data verification
 */

export const NATO_PHONETIC_ALPHABET: Record<string, string> = {
  A: 'Alpha',
  B: 'Bravo',
  C: 'Charlie',
  D: 'Delta',
  E: 'Echo',
  F: 'Foxtrot',
  G: 'Golf',
  H: 'Hotel',
  I: 'India',
  J: 'Juliet',
  K: 'Kilo',
  L: 'Lima',
  M: 'Mike',
  N: 'November',
  O: 'Oscar',
  P: 'Papa',
  Q: 'Quebec',
  R: 'Romeo',
  S: 'Sierra',
  T: 'Tango',
  U: 'Uniform',
  V: 'Victor',
  W: 'Whiskey',
  X: 'X-ray',
  Y: 'Yankee',
  Z: 'Zulu',
}

/**
 * Convert text to NATO phonetic alphabet
 * @example
 * textToPhonetic('BMW') => 'Bravo Mike Whiskey'
 */
export function textToPhonetic(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .filter(char => /[A-Z]/.test(char))
    .map(char => NATO_PHONETIC_ALPHABET[char])
    .filter(Boolean)
    .join(' ')
}

/**
 * Verify spelling using phonetic alphabet
 * Returns formatted string for audio/display
 */
export function getSpellingVerification(text: string): {
  phonetic: string
  letters: string[]
  message: string
} {
  const uppercase = text.toUpperCase()
  const letters = uppercase
    .split('')
    .filter(char => /[A-Z]/.test(char))
  
  const phonetics = letters.map(char => NATO_PHONETIC_ALPHABET[char])

  return {
    phonetic: phonetics.join(', '),
    letters,
    message: `Let me confirm the spelling: ${phonetics.join(', ')}. Is that correct?`,
  }
}

/**
 * Parse phonetic alphabet back to letters
 * @example
 * phoneticToText('Bravo Mike Whiskey') => 'BMW'
 */
export function phoneticToText(phoneticStr: string): string {
  const words = phoneticStr.split(/[\s,]+/).filter(Boolean)
  const reverseMap: Record<string, string> = {}
  
  // Create reverse mapping
  Object.entries(NATO_PHONETIC_ALPHABET).forEach(([letter, phonetic]) => {
    reverseMap[phonetic.toUpperCase()] = letter
  })

  return words
    .map(word => reverseMap[word.toUpperCase()] || '')
    .filter(Boolean)
    .join('')
}

/**
 * Format name with phonetic confirmation
 * Used for customer verification
 */
export function formatNameVerification(name: string): string {
  const parts = name.split(' ')
  const verifications = parts.map(part => {
    const firstLetter = part[0].toUpperCase()
    const phonetic = NATO_PHONETIC_ALPHABET[firstLetter] || '?'
    return `${part} (${phonetic})`
  })
  return verifications.join(', ')
}

/**
 * Validate email using phonetic parts
 */
export function getEmailPhoneticBreakdown(email: string): {
  parts: string[]
  phonetics: Record<string, string>
} {
  const [localPart, domain] = email.split('@')
  const parts = [localPart, domain]
  
  const phonetics: Record<string, string> = {}
  parts.forEach(part => {
    phonetics[part] = textToPhonetic(part)
  })

  return { parts, phonetics }
}

/**
 * Get car brand verification
 * Common car brands phonetically verified
 */
export function getCarBrandPhonetic(brand: string): string {
  const uppercase = brand.toUpperCase()
  // For single letters (BMW, VW), spell out completely
  if (uppercase.length <= 3 && /^[A-Z]+$/.test(uppercase)) {
    return textToPhonetic(uppercase)
  }
  // For words, spell out the word
  return textToPhonetic(uppercase)
}
