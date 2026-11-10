import type { ProviderSearchRecord } from '../constants';
import {
  buildRankReason,
  compareRanked,
  computeQiltIndex,
  computeSupportCounts,
  formatSignedPoints,
  parseCount,
  parsePercent,
  sortProvidersForTier,
  toRankedProvider,
  type RankedProvider,
} from '../providerRanking';
import {
  buildProviderRankReasons,
  buildProviderRankSignals,
  getProviderRankSignals,
  getQiltStatsForSlug,
} from '../providerRankingSignals';
import { resolveProviderSearchFilters } from '../resolveFilters';
import { searchProvidersByFilters } from '../searchProviders';

function ranked(overrides: Partial<RankedProvider> & Pick<RankedProvider, 'name'>): RankedProvider {
  return {
    tier: 'emerging',
    certified: false,
    qilt: null,
    supportInPlace: null,
    ...overrides,
  };
}

function makeProvider(
  overrides: Partial<ProviderSearchRecord> & Pick<ProviderSearchRecord, 'slug' | 'name' | 'kind'>,
): ProviderSearchRecord {
  return {
    interestAreas: [],
    locations: [],
    ndaCertified: false,
    hasPromotedCourses: false,
    ...overrides,
  };
}

function resultsFor(area: string, location: string) {
  const { filters, context } = resolveProviderSearchFilters({
    InterestArea: area,
    Location: location,
  });
  const signals = buildProviderRankSignals(context.providers);
  return { results: searchProvidersByFilters(context.providers, filters, signals), signals };
}

describe('parsePercent', () => {
  it('parses QILT percentages', () => {
    expect(parsePercent('84.6%')).toBe(84.6);
    expect(parsePercent('-3.2%')).toBe(-3.2);
  });

  it('rejects suppression and junk', () => {
    expect(parsePercent('L/N')).toBeNull();
    expect(parsePercent('')).toBeNull();
    expect(parsePercent(undefined)).toBeNull();
    expect(parsePercent(null)).toBeNull();
    expect(parsePercent('n/a')).toBeNull();
  });
});

describe('parseCount', () => {
  it('parses grouped response counts', () => {
    expect(parseCount('1,278')).toBe(1278);
    expect(parseCount('297')).toBe(297);
  });

  it('rejects junk', () => {
    expect(parseCount('L/N')).toBeNull();
    expect(parseCount('')).toBeNull();
    expect(parseCount(undefined)).toBeNull();
    expect(parseCount(null)).toBeNull();
  });
});

describe('computeQiltIndex', () => {
  it('averages the delta against the national average', () => {
    const index = computeQiltIndex([
      { value: '81.1%', nationalAverage: '76.5%', responses: '297' },
      { value: '86.7%', nationalAverage: '81.2%', responses: '285' },
    ]);
    // Fewer than four dimensions: suppressed rather than half-reported.
    expect(index).toBeNull();
  });

  it('produces an index at four usable dimensions', () => {
    const index = computeQiltIndex([
      { value: '80%', nationalAverage: '70%', responses: '100' },
      { value: '80%', nationalAverage: '70%', responses: '200' },
      { value: '80%', nationalAverage: '70%', responses: '300' },
      { value: '80%', nationalAverage: '70%', responses: '400' },
      { value: 'L/N', nationalAverage: '70%', responses: '500' },
      { value: '80%', nationalAverage: '70%', responses: '600' },
    ]);
    expect(index).toEqual({ points: 10, dims: 5, responses: 600 });
  });

  it('skips L/N rather than treating it as zero', () => {
    const withSuppression = computeQiltIndex([
      { value: 'L/N', nationalAverage: '70%', responses: '1' },
      { value: '80%', nationalAverage: '70%', responses: '100' },
      { value: '80%', nationalAverage: '70%', responses: '200' },
      { value: '80%', nationalAverage: '70%', responses: '300' },
      { value: '80%', nationalAverage: '70%', responses: '400' },
      { value: '80%', nationalAverage: '70%', responses: '500' },
    ]);
    expect(withSuppression?.dims).toBe(5);
    expect(withSuppression?.points).toBe(10);
  });

  it('treats missing response counts as zero and ignores unparsable values', () => {
    const index = computeQiltIndex([
      { value: '80%', nationalAverage: '70%' },
      { value: '80%', nationalAverage: '70%' },
      { value: '80%', nationalAverage: '70%' },
      { value: '80%', nationalAverage: '70%' },
    ]);
    expect(index).toEqual({ points: 10, dims: 4, responses: 0 });
  });
});

describe('computeSupportCounts', () => {
  it('counts in-place and in-works items', () => {
    expect(
      computeSupportCounts([
        { status: 'Supports in place' },
        { status: 'Supports in place' },
        { status: 'In the works' },
      ]),
    ).toEqual({ inPlace: 2, inWorks: 1 });
  });

  it('returns null when there is no framework', () => {
    expect(computeSupportCounts([])).toBeNull();
    expect(computeSupportCounts(undefined)).toBeNull();
  });
});

describe('compareRanked', () => {
  it('never lets an emerging provider precede an endorsed one', () => {
    const endorsed = ranked({ tier: 'endorsed', name: 'Zeta', supportInPlace: 1 });
    const emerging = ranked({ tier: 'emerging', name: 'Alpha', qilt: 99 });
    expect(compareRanked(endorsed, emerging)).toBeLessThan(0);
    expect(compareRanked(emerging, endorsed)).toBeGreaterThan(0);
  });

  it('puts certified providers first within a tier', () => {
    const certified = ranked({
      tier: 'endorsed',
      certified: true,
      name: 'Zeta',
      supportInPlace: 1,
    });
    const uncertified = ranked({ tier: 'endorsed', name: 'Alpha', supportInPlace: 50 });
    expect(compareRanked(certified, uncertified)).toBeLessThan(0);
  });

  it('sorts an uncertified provider after a certified one', () => {
    const uncertified = ranked({ tier: 'endorsed', name: 'Alpha', supportInPlace: 50 });
    const certified = ranked({ tier: 'endorsed', certified: true, name: 'Zeta' });
    expect(compareRanked(uncertified, certified)).toBeGreaterThan(0);
  });

  it('orders endorsed providers by absolute supports in place, not proportion', () => {
    const broad = ranked({ tier: 'endorsed', name: 'Broad', supportInPlace: 43 });
    const narrow = ranked({ tier: 'endorsed', name: 'Narrow', supportInPlace: 5 });
    expect(compareRanked(broad, narrow)).toBeLessThan(0);
  });

  it('orders emerging providers by QILT points descending', () => {
    const high = ranked({ name: 'Small', qilt: 22.3 });
    const low = ranked({ name: 'Large', qilt: 2.1 });
    expect(compareRanked(high, low)).toBeLessThan(0);
  });

  it('sorts providers without QILT data last', () => {
    const scored = ranked({ name: 'Scored', qilt: -3.2 });
    const unscored = ranked({ name: 'Unscored', qilt: null });
    expect(compareRanked(scored, unscored)).toBeLessThan(0);
    expect(compareRanked(unscored, scored)).toBeGreaterThan(0);
  });

  it('sorts an endorsed provider without support counts after one with counts', () => {
    const counted = ranked({ tier: 'endorsed', name: 'Counted', supportInPlace: 0 });
    const missing = ranked({ tier: 'endorsed', name: 'Missing', supportInPlace: null });
    expect(compareRanked(counted, missing)).toBeLessThan(0);
    expect(compareRanked(missing, counted)).toBeGreaterThan(0);
  });

  it('falls through to name on equal scores', () => {
    const a = ranked({ name: 'Alpha', qilt: 5 });
    const b = ranked({ name: 'Beta', qilt: 5 });
    expect(compareRanked(a, b)).toBeLessThan(0);
    expect(compareRanked(b, a)).toBeGreaterThan(0);

    const c = ranked({ tier: 'endorsed', name: 'Alpha', supportInPlace: 10 });
    const d = ranked({ tier: 'endorsed', name: 'Beta', supportInPlace: 10 });
    expect(compareRanked(c, d)).toBeLessThan(0);
  });

  it('falls through to name for emerging providers with equal QILT scores', () => {
    const a = ranked({ name: 'Alpha', qilt: 5 });
    const b = ranked({ name: 'Beta', qilt: 5 });
    expect(compareRanked(a, b)).toBeLessThan(0);
  });
});

describe('toRankedProvider', () => {
  it('reads certification and signals for a known slug', () => {
    const signals = new Map([
      [
        'known',
        { qilt: { points: 12.5, dims: 5, responses: 100 }, support: { inPlace: 4, inWorks: 2 } },
      ],
    ]);

    expect(
      toRankedProvider(
        makeProvider({ slug: 'known', name: 'Known', kind: 'endorsed', ndaCertified: true }),
        'endorsed',
        signals,
      ),
    ).toEqual({
      tier: 'endorsed',
      certified: true,
      name: 'Known',
      qilt: 12.5,
      supportInPlace: 4,
    });
  });

  it('returns nulls for a slug without signals', () => {
    expect(
      toRankedProvider(
        makeProvider({ slug: 'unknown', name: 'Unknown', kind: 'emerging' }),
        'emerging',
        new Map(),
      ),
    ).toEqual({
      tier: 'emerging',
      certified: false,
      name: 'Unknown',
      qilt: null,
      supportInPlace: null,
    });
  });
});

describe('sortProvidersForTier', () => {
  it('sorts a copy and leaves the input untouched', () => {
    const providers = [
      makeProvider({ slug: 'a', name: 'Alpha', kind: 'emerging' }),
      makeProvider({ slug: 'b', name: 'Beta', kind: 'emerging' }),
    ];
    const signals = new Map([
      ['a', { qilt: { points: 1, dims: 4, responses: 0 }, support: null }],
      ['b', { qilt: { points: 9, dims: 4, responses: 0 }, support: null }],
    ]);

    const sorted = sortProvidersForTier(providers, 'emerging', signals);

    expect(sorted.map((provider) => provider.slug)).toEqual(['b', 'a']);
    expect(providers.map((provider) => provider.slug)).toEqual(['a', 'b']);
  });
});

describe('buildRankReason', () => {
  it('states support counts for endorsed providers', () => {
    expect(
      buildRankReason({
        tier: 'endorsed',
        signals: { qilt: null, support: { inPlace: 43, inWorks: 8 } },
        isVet: true,
      }),
    ).toBe('43 supports in place · 8 in the works');
  });

  it('states the QILT delta and sample size for emerging providers', () => {
    expect(
      buildRankReason({
        tier: 'emerging',
        signals: { qilt: { points: 18.1818, dims: 6, responses: 100 }, support: null },
        isVet: false,
      }),
    ).toBe('Student experience +18.2 pts vs national avg (n=100)');
  });

  it('never invents data for a provider without signals', () => {
    expect(buildRankReason({ tier: 'emerging', signals: undefined, isVet: false })).toBe('');
    expect(buildRankReason({ tier: 'endorsed', signals: undefined, isVet: true })).toBe(
      'QILT does not survey VET providers',
    );
    expect(buildRankReason({ tier: 'endorsed', signals: undefined, isVet: false })).toBe('');
  });

  it('omits the sample size when no responses were reported', () => {
    expect(
      buildRankReason({
        tier: 'emerging',
        signals: { qilt: { points: 3, dims: 4, responses: 0 }, support: null },
        isVet: false,
      }),
    ).toBe('Student experience +3.0 pts vs national avg');
  });
});

describe('formatSignedPoints', () => {
  it('formats to one decimal with an explicit sign', () => {
    expect(formatSignedPoints(18.1818)).toBe('+18.2');
    expect(formatSignedPoints(-3.1818)).toBe('-3.2');
    expect(formatSignedPoints(0)).toBe('+0.0');
  });
});

describe('sorting real search results', () => {
  it('is deterministic when the input order is shuffled', () => {
    const { filters, context } = resolveProviderSearchFilters({
      InterestArea: 'IT',
      Location: 'NSW',
    });
    const signals = buildProviderRankSignals(context.providers);
    const forward = searchProvidersByFilters(context.providers, filters, signals);
    const reversed = searchProvidersByFilters([...context.providers].reverse(), filters, signals);

    expect(reversed.course_endorsed.map((p) => p.slug)).toEqual(
      forward.course_endorsed.map((p) => p.slug),
    );
    expect(reversed.endorsed.map((p) => p.slug)).toEqual(forward.endorsed.map((p) => p.slug));
    expect(reversed.emerging.map((p) => p.slug)).toEqual(forward.emerging.map((p) => p.slug));
  });

  it('keeps tier dominance across a mixed result set', () => {
    const { results } = resultsFor('IT', 'NSW');
    expect(results.course_endorsed).toHaveLength(0);
    expect(results.endorsed.map((p) => p.slug)).toEqual(['nepean-community-college']);
    expect(results.emerging.length).toBeGreaterThan(0);
  });

  it('orders IT in NSW by QILT index', () => {
    const { results } = resultsFor('IT', 'NSW');
    expect(results.emerging.map((p) => p.slug)).toEqual([
      'campion-college-australia', // +18.2
      'asa-institute-of-higher-education', // +14.6
      'australian-institute-of-higher-education-aih', // +7.5
      'international-college-of-management-sydney-icms', // +7.1
      'uow-college-australia', // +6.3
      'holmes-institute', // +5.8
      'asia-pacific-international-college-apic', // +5.6
      'university-of-wollongong-uow', // +3.8
      'university-of-technology-sydney-uts', // +2.1
      'alphacrucis-university-college', // -3.2
    ]);
  });

  it('orders Business in VIC by QILT index', () => {
    const { results } = resultsFor('Business', 'VIC');
    expect(results.emerging.map((p) => p.slug)).toEqual([
      'marcus-oldham-college',
      'lyons-college',
      'chisholm-institute',
      'academies-australasia-polytechnic',
      'victoria-university-vu',
      'la-trobe-college-australia',
    ]);
  });

  it('reproduces the published IT in NSW QILT points', () => {
    const { results, signals } = resultsFor('IT', 'NSW');
    const points = Object.fromEntries(
      results.emerging.map((p) => [
        p.slug,
        formatSignedPoints(signals.get(p.slug)?.qilt?.points ?? 0),
      ]),
    );
    expect(points['campion-college-australia']).toBe('+18.2');
    expect(points['asa-institute-of-higher-education']).toBe('+14.6');
    expect(points['australian-institute-of-higher-education-aih']).toBe('+7.5');
    expect(points['international-college-of-management-sydney-icms']).toBe('+7.1');
    expect(points['uow-college-australia']).toBe('+6.3');
    expect(points['holmes-institute']).toBe('+5.8');
    expect(points['asia-pacific-international-college-apic']).toBe('+5.6');
    expect(points['university-of-wollongong-uow']).toBe('+3.8');
    expect(points['university-of-technology-sydney-uts']).toBe('+2.1');
    expect(points['alphacrucis-university-college']).toBe('-3.2');
  });

  it('never crashes on a provider with no signals', () => {
    const orphan = makeProvider({
      slug: 'not-in-catalog',
      name: 'Nowhere College',
      kind: 'emerging',
    });
    expect(getProviderRankSignals(orphan.slug)).toEqual({ qilt: null, support: null });
    const signals = buildProviderRankSignals([orphan]);
    expect(signals.get(orphan.slug)).toEqual({ qilt: null, support: null });
  });
});

describe('providerRankingSignals', () => {
  it('returns no QILT rows for an unknown slug', () => {
    expect(getQiltStatsForSlug('does-not-exist')).toEqual([]);
  });

  it('returns labelled QILT dimensions for a known emerging provider', () => {
    const rows = getQiltStatsForSlug('campion-college-australia');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toEqual(expect.objectContaining({ title: 'Overall experience' }));
    expect(rows[0]).toHaveProperty('value');
    expect(rows[0]).toHaveProperty('nationalAverage');
    expect(typeof rows[0].responses).toBe('string');
  });

  it('caches support counts per slug and returns null for unknown providers', () => {
    const first = getProviderRankSignals('campion-college-australia');
    const second = getProviderRankSignals('campion-college-australia');
    expect(second).toEqual(first);
    expect(getProviderRankSignals('does-not-exist').support).toBeNull();
  });

  it('builds one reason per provider keyed by slug', () => {
    const { context } = resolveProviderSearchFilters({
      InterestArea: 'IT',
      Location: 'NSW',
    });
    const signals = buildProviderRankSignals(context.providers);
    const reasons = buildProviderRankReasons(context.providers, signals);

    expect(Object.keys(reasons)).toHaveLength(context.providers.length);
    expect(reasons['campion-college-australia']).toContain('Student experience');
  });
});
