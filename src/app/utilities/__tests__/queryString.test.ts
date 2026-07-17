/**
 * @jest-environment jsdom
 */
import queryString from '@/app/utilities/queryString';

describe('queryString', () => {
  describe('stringify', () => {
    it('converts a simple record to a query string with ? delimiter', () => {
      const result = queryString.stringify({ name: 'alice', age: 30 });
      expect(result).toContain('?');
      expect(result).toContain('name=alice');
      expect(result).toContain('age=30');
    });

    it('omits the ? delimiter when addDelimiter is false', () => {
      const result = queryString.stringify(
        { key: 'val' },
        { addDelimiter: false }
      );
      expect(result).not.toContain('?');
      expect(result).toBe('key=val');
    });

    it('handles array values by appending multiple entries', () => {
      const result = queryString.stringify({ tags: ['a', 'b'] });
      const params = new URLSearchParams(result);
      expect(params.getAll('tags')).toEqual(['a', 'b']);
    });

    it('removes keys set to undefined', () => {
      const result = queryString.stringify({ keep: 'yes', remove: undefined });
      expect(result).toContain('keep=yes');
      expect(result).not.toContain('remove');
    });

    it('encodes special characters in values', () => {
      const result = queryString.stringify({ q: 'hello world&more' });
      // stringify calls encodeURIComponent, then URLSearchParams re-encodes
      expect(result).toContain('q=');
      const params = new URLSearchParams(result);
      expect(decodeURIComponent(params.get('q') || '')).toBe(
        'hello world&more'
      );
    });

    it('handles null values by converting to string "null"', () => {
      const result = queryString.stringify({ x: null });
      expect(result).toContain('x=null');
    });

    it('returns empty string when record produces no params and addDelimiter is false', () => {
      const result = queryString.stringify(
        { gone: undefined },
        { addDelimiter: false }
      );
      expect(result).toBe('');
    });
  });

  describe('parse', () => {
    it('parses a simple query string into an object', () => {
      const result = queryString.parse('?name=alice&age=30');
      expect(result).toEqual({ name: 'alice', age: '30' });
    });

    it('decodes encoded values', () => {
      const result = queryString.parse(
        `?q=${encodeURIComponent('hello world')}`
      );
      expect(result).toEqual({ q: 'hello world' });
    });

    it('groups duplicate keys into an array', () => {
      const result = queryString.parse('?tag=a&tag=b&tag=c');
      expect(result).toEqual({ tag: ['a', 'b', 'c'] });
    });

    it('returns an empty object for empty input', () => {
      const result = queryString.parse('');
      expect(result).toEqual({});
    });

    it('handles values without a leading ?', () => {
      const result = queryString.parse('key=val');
      expect(result).toEqual({ key: 'val' });
    });
  });
});
