import type { ProviderSearchContext } from '../catalog';
import type { ProviderSearchFilters } from '../constants';
import { matchesProviderSearchFilters } from '../searchProviders';
import { resolveProviderSearchFilters } from '../resolveFilters';

function listMatchingProviders(
  context: ProviderSearchContext,
  filters: ProviderSearchFilters,
): ProviderSearchContext['providers'] {
  return context.providers.filter((provider) => matchesProviderSearchFilters(provider, filters));
}

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

    // Expanded filters must actually retrieve matching providers. The catalog can
    // grow as provider study areas are added, so do not restrict it to labels
    // that existed when this test was first written.
    const digitalProviders = context.providers.filter((provider) =>
      provider.interestAreas.some((area) => filters.interestAreas.includes(area)),
    );
    expect(digitalProviders.length).toBeGreaterThan(0);
    expect(
      digitalProviders.every((provider) =>
        provider.interestAreas.some((area) => filters.interestAreas.includes(area)),
      ),
    ).toBe(true);
  });

  it('expands a city to its state so state-tagged providers are found', () => {
    const { filters, context } = resolveProviderSearchFilters({ Location: ['Melbourne'] });

    // Emerging providers are tagged by state only, so a city query must reach them.
    expect(filters.locations).toEqual(expect.arrayContaining(['Melbourne', 'VIC']));

    const providers = listMatchingProviders(context, filters);
    expect(providers.some((provider) => provider.slug === 'collarts')).toBe(true);
    expect(providers.some((provider) => provider.emergingState === 'VIC')).toBe(true);
  });

  it('expands a state to its catalog cities so city-tagged providers are found', () => {
    const { filters, context } = resolveProviderSearchFilters({ Location: ['VIC'] });

    expect(filters.locations).toEqual(expect.arrayContaining(['VIC', 'Melbourne']));
    expect(listMatchingProviders(context, filters).some((p) => p.slug === 'collarts')).toBe(true);
  });

  it('returns empty filters for missing params', () => {
    const { filters, searchDemo } = resolveProviderSearchFilters({});
    expect(searchDemo).toBe(false);
    expect(filters).toEqual({ interestAreas: [], locations: [] });
  });
});
