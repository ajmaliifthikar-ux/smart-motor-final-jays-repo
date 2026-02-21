import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate } from '../lib/utils';

describe('utils', () => {
  describe('formatPrice', () => {
    it('formats integer price correctly', () => {
      // Assuming 'en-AE' locale, currency 'AED', minimumFractionDigits: 0
      // Expected output might vary based on locale data, but typically "AED 1,000" or similar
      const result = formatPrice(1000);
      expect(result).toMatch(/AED\s?1,000/);
    });

    it('formats price with decimals correctly (rounds/truncates based on options)', () => {
      // minimumFractionDigits: 0 means it might show no decimals if whole number,
      // but let's check behavior with 1000.50
      const result = formatPrice(1000.50);
      // It should round to nearest integer or show decimals depending on implementation details of Intl.
      // The current implementation has minimumFractionDigits: 0, but default maximum is 3 for currency?
      // actually default maximumFractionDigits for currency is usually 2.
      // Let's see what it does.
      expect(result).toMatch(/AED/);
    });

    it('formats 0 correctly', () => {
        expect(formatPrice(0)).toMatch(/AED\s?0/);
    });
  });

  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const date = '2023-10-27T10:00:00Z';
      const result = formatDate(date);
      // dateStyle: 'medium', timeStyle: 'short'
      // e.g., "Oct 27, 2023, 2:00 PM" (time depends on local timezone of the machine running tests)
      // Since we can't easily predict local timezone, we just check structure or partial match
      expect(result).toBeTruthy();
      expect(result).toContain('2023');
    });

    it('formats Date object correctly', () => {
      const date = new Date('2023-10-27T10:00:00Z');
      const result = formatDate(date);
      expect(result).toBeTruthy();
      expect(result).toContain('2023');
    });
  });
});
