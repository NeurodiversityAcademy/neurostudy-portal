import { isFeatureEnabled } from '../featureToggle';

describe('isFeatureEnabled', () => {
  it('returns false when searchParams is undefined', () => {
    expect(isFeatureEnabled(undefined, 'foo')).toBe(false);
  });

  it('returns true for explicit "true" (case-insensitive)', () => {
    expect(isFeatureEnabled({ searchBar: 'true' }, 'searchBar')).toBe(true);
    expect(isFeatureEnabled({ searchBar: 'True' }, 'searchBar')).toBe(true);
    expect(isFeatureEnabled({ searchBar: ['true'] }, 'searchBar')).toBe(true);
  });

  it('returns false for other values', () => {
    expect(isFeatureEnabled({ searchBar: 'false' }, 'searchBar')).toBe(false);
    expect(isFeatureEnabled({ other: 'true' }, 'searchBar')).toBe(false);
  });

  it('ignores empty key or missing key', () => {
    expect(isFeatureEnabled({ searchBar: 'true' }, '')).toBe(false);
    expect(isFeatureEnabled({ foo: undefined }, 'foo')).toBe(false);
  });
});
