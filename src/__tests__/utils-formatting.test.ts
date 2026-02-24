import { formatPrice, formatDate } from '@/lib/utils';
import { describe, it, expect } from 'vitest';

describe('utils formatting', () => {
  it('formatPrice should format currency correctly', () => {
    // Note: The space character might be a non-breaking space (U+00A0).
    // We check for the presence of "AED" and the formatted number.
    const price = 1234.56;
    const formatted = formatPrice(price);

    // Check if it contains "AED"
    expect(formatted).toContain('AED');

    // Check if it contains the formatted number
    // 1234.56 -> 1,234.56 (minimumFractionDigits: 0 allows decimals if present, default max is 2)
    expect(formatted).toContain('1,234.56');
  });

  it('formatDate should format date correctly', () => {
    const date = new Date('2023-10-05T14:30:00');
    const formatted = formatDate(date);

    // Expected: "5 Oct 2023, 2:30 PM" (or similar depending on locale implementation specifics)
    // We check for parts of the date to be robust against minor locale differences if any.
    expect(formatted).toContain('5 Oct 2023');
    expect(formatted).toContain('2:30 PM');
  });

  it('formatDate should handle string input correctly', () => {
    const dateStr = '2023-10-05T14:30:00';
    const formatted = formatDate(dateStr);

    expect(formatted).toContain('5 Oct 2023');
    expect(formatted).toContain('2:30 PM');
  });
});
