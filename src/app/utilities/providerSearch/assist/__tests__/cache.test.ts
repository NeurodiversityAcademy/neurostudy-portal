import { buildAssistCacheKey, createTtlCache, normalizeAssistCacheText } from '../cache';

describe('createTtlCache', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns a value before it expires', () => {
    const cache = createTtlCache<string>({ maxEntries: 2, ttlMs: 1_000 });

    cache.set('key', 'value');

    expect(cache.get('key')).toBe('value');
    expect(cache.size).toBe(1);
  });

  it('drops an expired entry', () => {
    const cache = createTtlCache<string>({ maxEntries: 2, ttlMs: 1_000 });

    cache.set('key', 'value');
    jest.advanceTimersByTime(1_001);

    expect(cache.get('key')).toBeUndefined();
    expect(cache.size).toBe(0);
  });

  it('evicts the least-recently-used entry when full', () => {
    const cache = createTtlCache<string>({ maxEntries: 2, ttlMs: 1_000 });

    cache.set('a', 'A');
    cache.set('b', 'B');
    // Touch "a" so "b" becomes the oldest.
    expect(cache.get('a')).toBe('A');
    cache.set('c', 'C');

    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toBe('A');
    expect(cache.get('c')).toBe('C');
  });

  it('refreshes an existing key without growing the cache', () => {
    const cache = createTtlCache<number>({ maxEntries: 2, ttlMs: 1_000 });

    cache.set('a', 1);
    cache.set('a', 2);

    expect(cache.get('a')).toBe(2);
    expect(cache.size).toBe(1);
  });

  it('clears every entry', () => {
    const cache = createTtlCache<string>({ maxEntries: 2, ttlMs: 1_000 });

    cache.set('a', 'A');
    cache.set('b', 'B');
    cache.clear();

    expect(cache.size).toBe(0);
    expect(cache.get('a')).toBeUndefined();
  });

  it('rejects invalid options', () => {
    expect(() => createTtlCache({ maxEntries: 0, ttlMs: 1_000 })).toThrow();
    expect(() => createTtlCache({ maxEntries: 1, ttlMs: 0 })).toThrow();
  });
});

describe('assist cache keys', () => {
  it('normalises case and whitespace', () => {
    expect(normalizeAssistCacheText('  Nursing   in VIC ')).toBe('nursing in vic');
  });

  it('builds a stable key for the same parts', () => {
    expect(buildAssistCacheKey(['model', 'system', 'query'])).toBe(
      buildAssistCacheKey(['model', 'system', 'query']),
    );
  });

  it('separates different parts', () => {
    expect(buildAssistCacheKey(['model', 'system', 'nursing'])).not.toBe(
      buildAssistCacheKey(['model', 'system', 'design']),
    );
  });
});
