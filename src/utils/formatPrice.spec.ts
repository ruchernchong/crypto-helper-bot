import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  test('should return the value as a valid price', () => {
    expect(formatPrice(123.45)).toBe('$123.45');
    expect(formatPrice(1000)).toBe('$1000');
  });
});
