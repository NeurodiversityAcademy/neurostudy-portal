import { resolveProviderSearchFilters } from '../resolveFilters';

describe('resolveProviderSearchFilters', () => {
  it('keeps catalog values, free-text partial queries, and detects searchDemo', () => {
    const { filters, searchDemo } = resolveProviderSearchFilters({
      InterestArea: ['Music', 'digital', 'x'],
      Location: ['Sydney', 'pen'],
      searchDemo: '1',
    });

    expect(searchDemo).toBe(true);
    // Free-text partial queries are kept; tokens shorter than 2 chars are dropped.
    expect(filters.interestAreas).toEqual(['digital', 'Music']);
    expect(filters.locations).toEqual(['pen', 'Sydney']);
  });

  it('returns empty filters for missing params', () => {
    const { filters, searchDemo } = resolveProviderSearchFilters({});
    expect(searchDemo).toBe(false);
    expect(filters).toEqual({ interestAreas: [], locations: [] });
  });
});
