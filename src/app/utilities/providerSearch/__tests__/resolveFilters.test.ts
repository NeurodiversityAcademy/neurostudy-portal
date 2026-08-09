import { resolveProviderSearchFilters } from '../resolveFilters';

describe('resolveProviderSearchFilters', () => {
  it('expands partial queries onto catalog labels and detects searchDemo', () => {
    const { filters, searchDemo } = resolveProviderSearchFilters({
      InterestArea: ['Music', 'digital', 'x'],
      Location: ['Sydney', 'pen'],
      searchDemo: '1',
    });

    expect(searchDemo).toBe(true);
    // "digital" expands to catalog study areas; short tokens are dropped.
    expect(filters.interestAreas).toEqual(
      expect.arrayContaining(['Digital Skills', 'Digital Technology', 'Music']),
    );
    expect(filters.interestAreas).not.toContain('digital');
    expect(filters.locations).toEqual(expect.arrayContaining(['Penrith', 'Sydney']));
    expect(filters.locations).not.toContain('pen');
  });

  it('returns empty filters for missing params', () => {
    const { filters, searchDemo } = resolveProviderSearchFilters({});
    expect(searchDemo).toBe(false);
    expect(filters).toEqual({ interestAreas: [], locations: [] });
  });
});
