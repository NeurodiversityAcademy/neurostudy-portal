import { buildCompareProvider, isKnownProviderSlug } from '../providerCompare';

jest.mock('@/app/utilities/providerSearch/catalog', () => ({
  loadProviderSearchContext: () => ({
    providers: [
      {
        slug: 'alpha',
        name: 'Alpha College',
        kind: 'endorsed',
        locations: ['Melbourne'],
        ndaCertified: true,
        interestAreas: [],
        hasPromotedCourses: false,
      },
      {
        slug: 'beta',
        name: 'Beta Institute',
        kind: 'emerging',
        locations: ['VIC'],
        ndaCertified: false,
        emergingState: 'VIC',
        interestAreas: [],
        hasPromotedCourses: false,
      },
      {
        slug: 'gamma',
        name: 'Gamma College',
        kind: 'emerging',
        locations: ['NSW'],
        ndaCertified: false,
        interestAreas: [],
        hasPromotedCourses: false,
      },
    ],
  }),
}));

jest.mock('@/app/components/endorsedProviders/endorsedProviderPageData', () => ({
  getInstitutionTypeForSlug: (slug: string) => (slug === 'alpha' ? 'VET' : 'Higher Education'),
  getSupportFrameworkForSlug: () => [
    {
      section: 'Learning support',
      items: [
        { label: 'Peer mentoring', status: 'Supports in place' },
        { label: 'Quiet rooms', status: 'In the works' },
      ],
    },
  ],
}));

jest.mock('@/app/utilities/providerSearch/providerRankingSignals', () => ({
  getProviderRankSignals: (slug: string) =>
    slug === 'alpha'
      ? { qilt: { points: 4.2, dims: 5, responses: 120 }, support: { inPlace: 1, inWorks: 1 } }
      : { qilt: null, support: null },
  getQiltStatsForSlug: () => [
    { title: 'Overall experience', value: '80%', nationalAverage: '70%', responses: '120' },
  ],
}));

jest.mock('@/app/utilities/providerSearch/searchProviders', () => ({
  classifyProviderSearchTier: (provider: { kind: string }) =>
    provider.kind === 'endorsed' ? 'endorsed' : 'emerging',
}));

jest.mock('@/app/utilities/endorsedProvidersDemo', () => ({
  buildEndorsedProviderDetailHref: (slug: string) => `/endorsedproviders/${slug}`,
}));

jest.mock('@/app/emergingproviders/emergingProviderMetadata', () => ({
  buildEmergingProviderDetailHref: (slug: string) => `/emergingproviders/${slug}`,
}));

jest.mock('@/app/components/emergingInstitutions/emergingProviderProfileSlugs', () => ({
  hasEmergingProviderProfile: (slug: string) => slug === 'beta',
}));

describe('providerCompare', () => {
  it('knows which slugs exist', () => {
    expect(isKnownProviderSlug('alpha')).toBe(true);
    expect(isKnownProviderSlug('missing')).toBe(false);
  });

  it('returns null for an unknown slug', () => {
    expect(buildCompareProvider('missing')).toBeNull();
  });

  it('builds an endorsed provider with support sections and QILT rows', () => {
    expect(buildCompareProvider('alpha')).toEqual({
      slug: 'alpha',
      name: 'Alpha College',
      tier: 'endorsed',
      type: 'VET',
      locations: ['Melbourne'],
      ndaCertified: true,
      supportInPlace: 1,
      supportInWorks: 1,
      supportSections: [
        {
          title: 'Learning support',
          items: [
            { label: 'Peer mentoring', status: 'Supports in place' },
            { label: 'Quiet rooms', status: 'In the works' },
          ],
        },
      ],
      qilt: {
        points: 4.2,
        dims: 5,
        responses: 120,
        stats: [
          { title: 'Overall experience', value: '80%', nationalAverage: '70%', responses: '120' },
        ],
      },
      detailHref: '/endorsedproviders/alpha',
    });
  });

  it('builds an emerging provider with a profile link', () => {
    expect(buildCompareProvider('beta')).toEqual({
      slug: 'beta',
      name: 'Beta Institute',
      tier: 'emerging',
      type: 'Emerging provider',
      locations: ['VIC'],
      ndaCertified: false,
      supportInPlace: null,
      supportInWorks: null,
      supportSections: [],
      qilt: null,
      detailHref: '/emergingproviders/beta',
    });
  });

  it('leaves the detail link empty for an emerging provider without a profile', () => {
    expect(buildCompareProvider('gamma')?.detailHref).toBe('');
  });
});
