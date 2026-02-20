import { formatPrice, formatDate } from '../lib/utils'
import { describe, it, expect } from 'vitest'

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price correctly in AED', () => {
      // The exact output might vary slightly depending on the environment (e.g. space vs non-breaking space)
      // but we expect it to contain AED and the number.
      const result = formatPrice(100)
      expect(result).toMatch(/AED\s+100/)
      expect(formatPrice(0)).toMatch(/AED\s+0/)
      // Check rounding behavior (minimumFractionDigits: 0)
      // Note: default maximumFractionDigits for currency is usually 2, so it won't round to integer unless max is also 0
      expect(formatPrice(1000.50)).toMatch(/AED\s+1,000\.5/)
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-10-27T10:30:00')
      const formatted = formatDate(date)
      expect(typeof formatted).toBe('string')
      // en-AE usually formats as "27 Oct 2023, 10:30 am" or similar
      expect(formatted).toContain('2023')
      expect(formatted).toContain('Oct')
    })
  })

  describe('Benchmark', () => {
    it('should measure performance of formatPrice', () => {
      const start = performance.now()
      for (let i = 0; i < 10000; i++) {
        formatPrice(i)
      }
      const end = performance.now()
      console.log(`formatPrice 10000 iterations: ${(end - start).toFixed(2)}ms`)
    })

    it('should measure performance of formatDate', () => {
      const date = new Date()
      const start = performance.now()
      for (let i = 0; i < 10000; i++) {
        formatDate(date)
      }
      const end = performance.now()
      console.log(`formatDate 10000 iterations: ${(end - start).toFixed(2)}ms`)
    })
  })
})
