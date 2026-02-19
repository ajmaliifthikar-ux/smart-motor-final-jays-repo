import { formatPrice, formatDate, parseColorToRGB } from '../lib/utils'
import { describe, it, expect } from 'vitest'

describe('utils', () => {
  it('formatPrice formats correctly', () => {
    // The output should contain AED and formatted number
    const result = formatPrice(1000)
    expect(result).toContain('AED')
    expect(result).toContain('1,000')
    expect(formatPrice(0)).toContain('0')
  })

  it('formatDate formats correctly', () => {
    // Using a fixed date
    const date = new Date('2023-01-01T12:00:00Z')
    const formatted = formatDate(date)
    // Check for year, month, day parts as exact format depends on locale/timezone
    // en-AE date style medium: "Jan 1, 2023" or similar
    expect(formatted).toContain('2023')
    expect(formatted).toContain('Jan')
  })

  it('parseColorToRGB parses correctly', () => {
    expect(parseColorToRGB('#000')).toEqual([0, 0, 0])
    expect(parseColorToRGB('#ffffff')).toEqual([255, 255, 255])
    expect(parseColorToRGB('red')).toEqual([255, 0, 0])
    expect(parseColorToRGB('bg-[#123456]')).toEqual([18, 52, 86])
    expect(parseColorToRGB('invalid')).toBeNull()
  })
})
