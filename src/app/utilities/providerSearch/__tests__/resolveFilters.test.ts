import { resolveProviderSearchFilters } from '../resolveFilters';

describe('resolveProviderSearchFilters', () => {
  it('keeps only catalog values and detects searchDemo', () => {
    const { filters, searchDemo } = resolveProviderSearchFilters({
      InterestArea: ['Music', 'NotARealArea'],
      Location: ['Sydney', 'Atlantis'],
      searchDemo: '1',
    });

    expect(searchDemo).toBe(true);
    expect(filters.interestAreas).toEqual(['Music']);
    expect(filters.locations).toEqual(['Sydney']);
  });

  it('returns empty filters for missing params', () => {
    const { filters, searchDemo } = resolveProviderSearchFilters({});
    expect(searchDemo).toBe(false);
    expect(filters).toEqual({ interestAreas: [], locations: [] });
  });
});
