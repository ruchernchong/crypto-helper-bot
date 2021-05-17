import { slugify } from './slugify';

describe('slugify', () => {
  test('should return a slugified string', () => {
    expect(slugify('Foo bar')).toBe('foo-bar');
    expect(slugify('foo')).toBe('foo');
  });
});
