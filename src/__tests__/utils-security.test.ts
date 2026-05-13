import { describe, it, expect } from 'vitest';
import { safeTitle } from '../lib/utils';

describe('safeTitle', () => {
  it('should return an empty string if input is empty', () => {
    expect(safeTitle('')).toBe('');
    expect(safeTitle(null as any)).toBe('');
    expect(safeTitle(undefined as any)).toBe('');
  });

  it('should escape dangerous HTML characters', () => {
    const input = '<script>alert("XSS & exploit \'here\'")</script>';
    const expected = '&lt;script&gt;alert(&quot;XSS &amp; exploit &#39;here&#39;&quot;)&lt;/script&gt;';
    expect(safeTitle(input)).toBe(expected);
  });

  it('should selectively restore <br /> tags', () => {
    const input = 'Hello <br /> World <br> <br/>';
    // Initially gets escaped, then restored
    const expected = 'Hello <br /> World <br /> <br />';
    expect(safeTitle(input)).toBe(expected);
  });

  it('should selectively restore <span class="text-gray-500"> tags', () => {
    const input = 'Hello <span class="text-gray-500">Gray</span> World';
    const expected = 'Hello <span class="text-gray-500">Gray</span> World';
    expect(safeTitle(input)).toBe(expected);
  });

  it('should selectively restore <span className="silver-shine"> tags and convert className to class', () => {
    const input = 'Hello <span className="silver-shine">Shine</span> World';
    const expected = 'Hello <span class="silver-shine">Shine</span> World';
    expect(safeTitle(input)).toBe(expected);
  });

  it('should not restore unauthorized <span> classes', () => {
    const input = 'Hello <span class="dangerous-class">Bad</span> World';
    const expected = 'Hello &lt;span class=&quot;dangerous-class&quot;&gt;Bad&lt;/span&gt; World';
    expect(safeTitle(input)).toBe(expected);
  });

  it('should not execute scripts within allowed tags', () => {
    const input = 'Hello <span class="text-gray-500" onclick="alert(1)">Gray</span> World';
    const expected = 'Hello &lt;span class=&quot;text-gray-500&quot; onclick=&quot;alert(1)&quot;&gt;Gray&lt;/span&gt; World';
    expect(safeTitle(input)).toBe(expected);
  });
});
