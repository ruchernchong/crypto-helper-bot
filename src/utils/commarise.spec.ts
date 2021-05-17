import { commarise } from './commarise';

interface Value {
  value: number;
  formattedValue: string;
}

const mockValues: Value[] = [
  { value: 1000, formattedValue: '1k' },
  { value: 1000000, formattedValue: '1M' },
  { value: 1000000000, formattedValue: '1B' },
  { value: 1000000000000, formattedValue: '1T' }
];

describe('commarise', () => {
  test('should return their named values accordingly', () => {
    mockValues.forEach(({ value, formattedValue }: Value) => {
      expect(commarise(value)).toEqual(formattedValue);
    });
  });

  test('should return its own number for values greater than 1e3', () => {
    expect(commarise(100)).toEqual('100');
  });
});
