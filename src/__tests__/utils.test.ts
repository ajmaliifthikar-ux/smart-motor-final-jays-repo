import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate } from '@/lib/utils'

describe('utils', () => {
  describe('formatPrice', () => {
    it('formats numbers as AED currency', () => {
      // Note: The space is likely U+00A0 (non-breaking space), so we normalize spaces for testing
      const formatted = formatPrice(1000).replace(/\u00A0/g, ' ')
      expect(formatted).toBe('AED 1,000')
    })

    it('formats zero correctly', () => {
      const formatted = formatPrice(0).replace(/\u00A0/g, ' ')
      expect(formatted).toBe('AED 0')
    })

    it('handles large numbers', () => {
      const formatted = formatPrice(1234567).replace(/\u00A0/g, ' ')
      expect(formatted).toBe('AED 1,234,567')
    })
  })

  describe('formatDate', () => {
    it('formats Date object correctly', () => {
      // Use specific date/time components to avoid timezone confusion if possible,
      // but '2023-10-05T14:30:00' in local time (UTC here) should format to the same string in local time.
      const date = new Date('2023-10-05T14:30:00')
      const formatted = formatDate(date)
      // Expect: "5 Oct 2023, 2:30 PM"
      // Note: older Node versions might output "Oct 5, 2023", but v18+ usually aligns with CLDR.
      // We'll check if it contains the key parts to be safe.
      expect(formatted).toContain('5 Oct 2023')
      expect(formatted).toContain('2:30 PM')
    })

    it('formats date string correctly', () => {
      const dateStr = '2023-10-05T14:30:00'
      const formatted = formatDate(dateStr)
      expect(formatted).toContain('5 Oct 2023')
      expect(formatted).toContain('2:30 PM')
    })
  })
})
