import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formats zero as IDR 0', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('formats positive amount with IDR', () => {
    const result = formatCurrency(15000);
    expect(result).toContain('Rp');
    expect(result).toContain('15');
  });

  it('formats large number with thousands separator', () => {
    const result = formatCurrency(1000000);
    expect(result).toContain('Rp');
    expect(result).toContain('1');
  });

  it('formats with no fraction digits', () => {
    const result = formatCurrency(999999999);
    expect(result).not.toContain(',');
  });
});
