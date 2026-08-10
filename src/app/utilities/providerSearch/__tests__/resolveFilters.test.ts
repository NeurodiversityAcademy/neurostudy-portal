import { resolveProviderSearchFilters } from '../resolveFilters';

describe('resolveProviderSearchFilters', () => {
  it('expands partial queries onto catalog labels and detects searchDemo', () => {
    const { filters, searchDemo, context } = resolveProviderSearchFilters({
      InterestArea: ['Music', 'digital', 'x'],
      Location: ['Sydney', 'pen'],
      searchDemo: '1',
    });

    expect(searchDemo).toBe(true);
    expect(context.searchDemo).toBe(true);
    expect(context.providers.some((provider) => provider.slug === 'collarts')).toBe(true);

    // "digital" expands to catalog study areas; short tokens are dropped.
    expect(filters.interestAreas).toEqual(
      expect.arrayContaining(['Digital Skills', 'Digital Technology', 'Music']),
    );
    expect(filters.interestAreas).not.toContain('digital');
    expect(filters.interestAreas).not.toContain('x');
    expect(filters.locations).toEqual(expect.arrayContaining(['Penrith', 'Sydney']));
    expect(filters.locations).not.toContain('pen');

    // Expanded filters must actually retrieve matching providers.
    const digitalProviders = context.providers.filter((provider) =>
      provider.interestAreas.some((area) =>
        filters.interestAreas.includes(area),
      ),
    );
    expect(digitalProviders.length).toBeGreaterThan(0);
    expect(
      digitalProviders.every((provider) =>
        provider.interestAreas.some((area) => area === 'Digital Skills' || area === 'Digital Technology' || area === 'Music'),
      ),
    ).toBe(true);
  });

  it('returns empty filters for missing params', () => {
    const { filters, searchDemo } = resolveProviderSearchFilters({});
    expect(searchDemo).toBe(false);
    expect(filters).toEqual({ interestAreas: [], locations: [] });
  });
});
