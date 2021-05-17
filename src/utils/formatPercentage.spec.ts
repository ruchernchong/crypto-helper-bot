import { formatPercentage } from './formatPercentage';

describe('formatPercentage', () => {
  test('should return the value as a valid percentage', () => {
    expect(formatPercentage(12.34)).toBe('12.34%');
    expect(formatPercentage('12.34')).toBe('12.34%');
  });

  test('should return the percentage as a whole number if there is no decimal', () => {
    expect(formatPercentage(100)).toBe('100%');
    expect(formatPercentage('1000')).toBe('1000%');
  });
});
