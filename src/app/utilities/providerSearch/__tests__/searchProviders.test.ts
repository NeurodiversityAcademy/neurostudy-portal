import {
  classifyProviderSearchTier,
  countProviderSearchResults,
  listPositionedProviderSearchResults,
  matchesProviderSearchFilters,
  searchProvidersByFilters,
} from '../searchProviders';
import type { ProviderSearchRecord } from '../constants';
import {
  matchesSearchToken,
  mergeSearchTokens,
  parseMultiQueryParam,
  resolveSearchFilterValues,
  tokensPartialMatch,
  uniqueSortedStrings,
} from '../normalize';
import {
  buildEndorsedCoursesHref,
  buildProviderSearchHref,
  isProviderSearchDemoEnabled,
} from '../buildSearchHref';
import {
  getProviderSearchInterestAreaCatalog,
  getProviderSearchLocationCatalog,
  listSearchableProviders,
  loadProviderSearchContext,
} from '../catalog';

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

describe('provider search matching', () => {
  const providers: ProviderSearchRecord[] = [
    makeProvider({
      kind: 'endorsed',
      slug: 'collarts',
      name: 'Collarts',
      interestAreas: ['Music', 'Design'],
      locations: ['Melbourne', 'Sydney'],
      hasPromotedCourses: true,
    }),
    makeProvider({
      kind: 'endorsed',
      slug: 'nepean-community-college',
      name: 'Nepean Community College',
      locations: ['Penrith', 'Sydney', 'NSW'],
      ndaCertified: true,
    }),
    makeProvider({
      kind: 'endorsed',
      slug: 'hsh',
      name: 'Health Science Hub',
      interestAreas: ['Nursing'],
      locations: ['Perth'],
    }),
    makeProvider({
      kind: 'emerging',
      slug: 'jazz-music-institute',
      name: 'Jazz Music Institute',
      interestAreas: ['Music'],
      locations: ['QLD'],
      emergingState: 'QLD',
    }),
  ];

  it('matches area-only with OR within field', () => {
    const results = searchProvidersByFilters(providers, {
      interestAreas: ['Music', 'Nursing'],
      locations: [],
    });
    expect(results.course_endorsed.map((p) => p.slug)).toEqual(['collarts']);
    expect(results.endorsed.map((p) => p.slug)).toEqual(['hsh']);
    expect(results.emerging.map((p) => p.slug)).toEqual(['jazz-music-institute']);
  });

  it('matches location-only including emerging state', () => {
    const results = searchProvidersByFilters(providers, {
      interestAreas: [],
      locations: ['Sydney', 'QLD'],
    });
    expect(results.course_endorsed.map((p) => p.slug)).toEqual(['collarts']);
    expect(results.endorsed.map((p) => p.slug)).toEqual(['nepean-community-college']);
    expect(results.emerging.map((p) => p.slug)).toEqual(['jazz-music-institute']);
  });

  it('places certified endorsed providers first within the endorsed list', () => {
    const results = searchProvidersByFilters(providers, {
      interestAreas: [],
      locations: ['Sydney', 'Perth'],
    });
    expect(results.endorsed.map((p) => p.slug)).toEqual(['nepean-community-college', 'hsh']);
    expect(results.endorsed[0]?.ndaCertified).toBe(true);
  });

  it('requires AND when both area and location are selected', () => {
    const results = searchProvidersByFilters(providers, {
      interestAreas: ['Music'],
      locations: ['Melbourne'],
    });
    expect(results.course_endorsed.map((p) => p.slug)).toEqual(['collarts']);
    expect(results.emerging).toEqual([]);
  });

  it('returns all providers when no filters selected', () => {
    const results = searchProvidersByFilters(providers, {
      interestAreas: [],
      locations: [],
    });
    expect(countProviderSearchResults(results)).toBe(providers.length);
  });

  it('sorts alphabetically within a tier', () => {
    const withExtra = [
      ...providers,
      makeProvider({
        kind: 'endorsed',
        slug: 'aaa-provider',
        name: 'AAA Provider',
        interestAreas: ['Nursing'],
        locations: ['Perth'],
      }),
    ];
    const results = searchProvidersByFilters(withExtra, {
      interestAreas: ['Nursing'],
      locations: [],
    });
    expect(results.endorsed.map((p) => p.name)).toEqual(['AAA Provider', 'Health Science Hub']);
  });

  it('classifies course-endorsed over plain endorsed; certified stays endorsed', () => {
    expect(
      classifyProviderSearchTier(
        makeProvider({
          kind: 'endorsed',
          slug: 'x',
          name: 'X',
          ndaCertified: true,
          hasPromotedCourses: true,
        }),
      ),
    ).toBe('course_endorsed');
    expect(
      classifyProviderSearchTier(
        makeProvider({
          kind: 'endorsed',
          slug: 'y',
          name: 'Y',
          ndaCertified: true,
        }),
      ),
    ).toBe('endorsed');
  });

  it('partial-matches tokens for catalog expansion and provider matching', () => {
    expect(tokensPartialMatch('Digital Skills', 'digital')).toBe(true);
    expect(tokensPartialMatch('Nursing', 'digital')).toBe(false);
    expect(tokensPartialMatch('a', 'ab')).toBe(false);
  });

  it('assigns stable global positions across tiers without render mutation', () => {
    const results = searchProvidersByFilters(providers, {
      interestAreas: ['Music'],
      locations: [],
    });
    const positioned = listPositionedProviderSearchResults(results);
    expect(positioned.map((item) => item.position)).toEqual(
      positioned.map((_, index) => index + 1),
    );
    expect(positioned[0]?.tier).toBe('course_endorsed');
  });

  it('parses multi query params from repeated and pipe-delimited values', () => {
    expect(parseMultiQueryParam(['Music|Design', 'Nursing'])).toEqual([
      'Design',
      'Music',
      'Nursing',
    ]);
  });
});

describe('provider search catalog seeds', () => {
  it('derives interest area catalog from tagged providers only', () => {
    const catalog = getProviderSearchInterestAreaCatalog();
    expect(catalog).toEqual(
      expect.arrayContaining([
        'Music & Audio',
        'Nursing',
        'Accredited Qualifications',
        'Training & Assessment (TAE)',
        'Fine Arts',
      ]),
    );
    expect(catalog.length).toBeGreaterThan(10);
  });

  it('includes emerging states in location catalog', () => {
    const catalog = getProviderSearchLocationCatalog();
    expect(catalog).toEqual(expect.arrayContaining(['NSW', 'QLD', 'VIC', 'Sydney', 'Melbourne']));
  });

  it('marks demo course-endorsed provider when searchDemo is enabled', () => {
    const providers = listSearchableProviders({ searchDemo: true });
    const collarts = providers.find((provider) => provider.slug === 'collarts');
    expect(collarts?.hasPromotedCourses).toBe(true);
  });
});

describe('provider search href helpers', () => {
  it('builds search href with area and location params', () => {
    expect(
      buildProviderSearchHref({
        interestAreas: ['Music'],
        locations: ['Sydney'],
      }),
    ).toBe('/search?InterestArea=Music&Location=Sydney');
  });

  it('builds courses href with optional searchDemo', () => {
    expect(buildEndorsedCoursesHref('collarts')).toBe('/endorsedproviders/collarts/courses');
    expect(buildEndorsedCoursesHref('collarts', { searchDemo: true })).toBe(
      '/endorsedproviders/collarts/courses?searchDemo=1',
    );
  });

  it('detects searchDemo flag case-insensitively', () => {
    expect(isProviderSearchDemoEnabled('1')).toBe(true);
    expect(isProviderSearchDemoEnabled('true')).toBe(false);
  });

  it('uniqueSortedStrings normalizes casing for uniqueness but keeps first casing', () => {
    expect(uniqueSortedStrings(['Sydney', 'sydney', 'Melbourne'])).toEqual(['Melbourne', 'Sydney']);
  });

  it('matchesProviderSearchFilters is case-insensitive', () => {
    expect(
      matchesProviderSearchFilters(
        makeProvider({
          kind: 'endorsed',
          slug: 'x',
          name: 'X',
          interestAreas: ['Music'],
          locations: ['Sydney'],
        }),
        { interestAreas: ['music'], locations: ['sydney'] },
      ),
    ).toBe(true);
  });

  it('partial-matches interest areas so digital finds Digital Skills and Digital Technology', () => {
    const withDigital = [
      makeProvider({
        kind: 'endorsed',
        slug: 'skills-uni',
        name: 'Skills Uni',
        interestAreas: ['Digital Skills'],
      }),
      makeProvider({
        kind: 'endorsed',
        slug: 'tech-uni',
        name: 'Tech Uni',
        interestAreas: ['Digital Technology'],
      }),
      makeProvider({
        kind: 'endorsed',
        slug: 'nursing-uni',
        name: 'Nursing Uni',
        interestAreas: ['Nursing'],
      }),
    ];

    expect(matchesSearchToken(['Digital Skills', 'Digital Technology'], 'digital')).toBe(true);
    expect(matchesSearchToken(['Nursing'], 'digital')).toBe(false);

    const results = searchProvidersByFilters(withDigital, {
      interestAreas: ['digital'],
      locations: [],
    });
    expect(results.endorsed.map((p) => p.slug).sort()).toEqual(['skills-uni', 'tech-uni']);
  });

  it('resolveSearchFilterValues expands free-text partial queries onto catalog labels', () => {
    expect(resolveSearchFilterValues(['digital', 'Music', 'a'], ['Music', 'Nursing'])).toEqual([
      'digital',
      'Music',
    ]);
    expect(
      resolveSearchFilterValues(['digital'], ['Digital Skills', 'Digital Technology', 'Nursing']),
    ).toEqual(['Digital Skills', 'Digital Technology']);
  });

  it('mergeSearchTokens includes typed draft text with selected values', () => {
    expect(mergeSearchTokens(['Music'], 'business')).toEqual(['business', 'Music']);
    expect(mergeSearchTokens([], '  business  ')).toEqual(['business']);
    expect(mergeSearchTokens(['Music'], '   ')).toEqual(['Music']);
  });

  it('loadProviderSearchContext returns providers and catalogs together', () => {
    const context = loadProviderSearchContext();
    expect(context.providers.length).toBeGreaterThan(0);
    expect(context.interestAreaCatalog).toEqual(getProviderSearchInterestAreaCatalog());
    expect(context.locationCatalog).toEqual(getProviderSearchLocationCatalog());
  });
});
