import { expect, test, describe } from 'vitest'
import { formatPrice, formatDate } from './utils'

describe('utils', () => {
  test('formatPrice formats numbers as AED currency', () => {
    const price = 1234;
    const formatted = formatPrice(price);
    // Check for "AED" and the number format.
    // The exact space character might vary (non-breaking space vs space), so we check loosely.
    expect(formatted).toContain('AED');
    expect(formatted).toContain('1,234');
  })

  test('formatDate formats dates correctly', () => {
    // using a fixed date
    const date = new Date('2023-10-27T12:00:00Z');
    const formatted = formatDate(date);

    // The output depends on the timezone of the environment running the test.
    // But it should definitely contain "Oct" and "2023".
    expect(formatted).toContain('Oct');
    expect(formatted).toContain('2023');
  })
})
