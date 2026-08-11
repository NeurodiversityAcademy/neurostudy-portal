import { resetProviderSearchContextCacheForTests } from '../catalog';
import { resolveProviderSearchFilters } from '../resolveFilters';

describe('resolveProviderSearchFilters', () => {
  beforeEach(() => {
    resetProviderSearchContextCacheForTests();
  });

  it('expands partial queries onto curated catalog labels and detects searchDemo', () => {
    const { filters, searchDemo, context } = resolveProviderSearchFilters({
      InterestArea: ['Music', 'nurs', 'x'],
      Location: ['Sydney', 'pen'],
      searchDemo: '1',
    });

    expect(searchDemo).toBe(true);
    expect(context.searchDemo).toBe(true);
    expect(context.providers.some((provider) => provider.slug === 'collarts')).toBe(true);

    // "nurs" expands onto Nursing; short free-text "x" is kept as-is (not partial-expanded).
    expect(filters.interestAreas).toEqual(expect.arrayContaining(['Music', 'Nursing', 'x']));
    expect(filters.interestAreas).not.toContain('nurs');
    expect(filters.locations).toEqual(expect.arrayContaining(['Penrith', 'Sydney']));
    expect(filters.locations).not.toContain('pen');

    // Catalog no longer includes profile marketing labels like "Digital Skills".
    expect(context.interestAreaCatalog).not.toEqual(expect.arrayContaining(['Digital Skills']));

    const musicProviders = context.providers.filter((provider) =>
      provider.interestAreas.includes('Music'),
    );
    expect(musicProviders.length).toBeGreaterThan(0);
  });

  it('returns empty filters for missing params', () => {
    const { filters, searchDemo } = resolveProviderSearchFilters({});
    expect(searchDemo).toBe(false);
    expect(filters).toEqual({ interestAreas: [], locations: [] });
  });
});
