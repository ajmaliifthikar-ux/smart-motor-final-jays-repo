import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate } from '@/lib/utils'

describe('formatPrice', () => {
    it('formats a number as AED currency', () => {
        const result = formatPrice(1234.56)
        // Matches "AED 1,234.56" (ignoring potential non-breaking space differences by checking parts)
        expect(result).toContain('AED')
        expect(result).toContain('1,234.56')
    })

    it('formats 0 correctly', () => {
        const result = formatPrice(0)
        expect(result).toContain('AED')
        expect(result).toMatch(/0(\.00)?$/) // 0 or 0.00 depending on implementation
    })
})

describe('formatDate', () => {
    it('formats a date object correctly', () => {
        const date = new Date('2023-10-24T12:30:00')
        const result = formatDate(date)
        // en-AE style: "24 Oct 2023, 12:30 PM"
        expect(result).toContain('24 Oct 2023')
        expect(result).toContain('12:30')
    })

    it('formats a date string correctly', () => {
        const dateStr = '2023-12-25T15:45:00'
        const result = formatDate(dateStr)
        expect(result).toContain('25 Dec 2023')
        expect(result).toMatch(/3:45/) // 15:45 is 3:45 PM
    })
})
