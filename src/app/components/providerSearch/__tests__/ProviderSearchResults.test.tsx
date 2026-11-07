/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import ProviderSearchResults from '../ProviderSearchResults';
import type { ProviderSearchTierResults } from '@/app/utilities/providerSearch/constants';

jest.mock('../../institutionProviderCard/InstitutionProviderCard', () => ({
  __esModule: true,
  default: ({
    center,
    ctaHref,
    comingSoonLabel,
    gaEvent,
    note,
  }: {
    center: React.ReactNode;
    ctaHref?: string;
    comingSoonLabel?: string;
    gaEvent?: { eventName: string; params: { provider_slug?: string; result_position?: number } };
    note?: React.ReactNode;
  }) => (
    <div data-testid='provider-card'>
      <div>{center}</div>
      {note ? <p data-testid='card-note'>{note}</p> : null}
      {ctaHref ? (
        <a href={ctaHref} data-event={gaEvent?.eventName} data-slug={gaEvent?.params.provider_slug}>
          Explore More
        </a>
      ) : (
        <span>{comingSoonLabel}</span>
      )}
    </div>
  ),
}));

jest.mock('../../emergingInstitutions/EmergingInstitutionCard', () => ({
  __esModule: true,
  default: ({
    name,
    state,
    gaEvent,
    note,
  }: {
    name: string;
    state: string;
    gaEvent?: { params: { destination_url?: string; provider_slug?: string } };
    note?: React.ReactNode;
  }) => (
    <div data-testid='emerging-card'>
      <span>{name}</span>
      <span>{state}</span>
      {note ? <p data-testid='card-note'>{note}</p> : null}
      {gaEvent?.params.destination_url ? (
        <a href={gaEvent.params.destination_url} data-slug={gaEvent.params.provider_slug}>
          Explore More
        </a>
      ) : (
        <span>Coming soon</span>
      )}
    </div>
  ),
}));

jest.mock('../../endorsedProviders/EndorsedCertifiedBadge', () => ({
  __esModule: true,
  default: () => <div>badge</div>,
}));

jest.mock('../../emergingInstitutions/emergingProviderProfileSlugs', () => ({
  hasEmergingProviderProfile: (slug: string) => slug === 'jazz-music-institute',
}));

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

const emptyResults = (): ProviderSearchTierResults => ({
  course_endorsed: [],
  endorsed: [],
  emerging: [],
});

describe('ProviderSearchResults', () => {
  it('renders empty state without directory links', () => {
    render(
      <ProviderSearchResults
        results={emptyResults()}
        filters={{ interestAreas: ['Music'], locations: [] }}
        searchDemo={false}
        totalCount={0}
      />,
    );

    expect(screen.getByText('No providers matched your search')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders matching providers as shared cards across tiers', () => {
    const results = emptyResults();
    results.course_endorsed = [
      {
        kind: 'endorsed',
        slug: 'collarts',
        name: 'Collarts',
        interestAreas: ['Music'],
        locations: ['Melbourne'],
        ndaCertified: false,
        hasPromotedCourses: true,
        logoSrc: '/images/AcademiaLogoLong.png',
        topBackgroundImage: '/images/CollartsCover.webp',
      },
    ];
    results.endorsed = [
      {
        kind: 'endorsed',
        slug: 'nepean-community-college',
        name: 'Nepean Community College',
        interestAreas: [],
        locations: ['Sydney'],
        ndaCertified: true,
        hasPromotedCourses: false,
        logoSrc: '/images/AcademiaLogoLong.png',
      },
    ];
    results.emerging = [
      {
        kind: 'emerging',
        slug: 'jazz-music-institute',
        name: 'Jazz Music Institute',
        interestAreas: ['Music'],
        locations: ['QLD'],
        ndaCertified: false,
        hasPromotedCourses: false,
        emergingState: 'QLD',
      },
    ];

    render(
      <ProviderSearchResults
        results={results}
        filters={{ interestAreas: ['Music'], locations: [] }}
        searchDemo
        totalCount={3}
        detailsUnlocked
      />,
    );

    expect(screen.getByText('Collarts')).toBeInTheDocument();
    expect(screen.getByText('Nepean Community College')).toBeInTheDocument();
    expect(screen.getByText('Jazz Music Institute')).toBeInTheDocument();
    expect(screen.getByText('Legend')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Explore More' })).not.toBeInTheDocument();
  });

  it('renders evidence notes when supplied and nothing when not', () => {
    const results = emptyResults();
    results.endorsed = [
      {
        kind: 'endorsed',
        slug: 'nepean-community-college',
        name: 'Nepean Community College',
        interestAreas: [],
        locations: ['Sydney'],
        ndaCertified: true,
        hasPromotedCourses: false,
      },
      {
        kind: 'endorsed',
        slug: 'no-evidence-college',
        name: 'No Evidence College',
        interestAreas: [],
        locations: ['Sydney'],
        ndaCertified: false,
        hasPromotedCourses: false,
      },
    ];

    render(
      <ProviderSearchResults
        results={results}
        filters={{ interestAreas: [], locations: [] }}
        searchDemo={false}
        totalCount={2}
        rankReasons={{
          'nepean-community-college': '43 supports in place · 8 in the works',
        }}
        detailsUnlocked
      />,
    );

    expect(screen.getByText('Nepean Community College')).toBeInTheDocument();
    expect(screen.queryByText('43 supports in place · 8 in the works')).not.toBeInTheDocument();
  });

  it('keeps shallow pills compact and hides links until the gate is unlocked', () => {
    const results = emptyResults();
    results.endorsed = [
      {
        kind: 'endorsed',
        slug: 'nepean-community-college',
        name: 'Nepean Community College',
        interestAreas: [],
        locations: ['Sydney'],
        ndaCertified: true,
        hasPromotedCourses: false,
      },
    ];

    render(
      <ProviderSearchResults
        results={results}
        filters={{ interestAreas: [], locations: [] }}
        searchDemo={false}
        totalCount={1}
        rankReasons={{ 'nepean-community-college': '43 supports in place · 8 in the works' }}
        detailsUnlocked={false}
      />,
    );

    expect(screen.getByText('Nepean Community College')).toBeInTheDocument();
    expect(screen.queryByText('43 supports in place · 8 in the works')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Explore More' })).not.toBeInTheDocument();
  });

  it('does not invent emerging CTAs when the provider has no profile', () => {
    const results = emptyResults();
    results.emerging = [
      {
        kind: 'emerging',
        slug: 'unknown-college',
        name: 'Unknown College',
        interestAreas: ['Music'],
        locations: ['NSW'],
        ndaCertified: false,
        hasPromotedCourses: false,
        emergingState: 'NSW',
      },
    ];

    render(
      <ProviderSearchResults
        results={results}
        filters={{ interestAreas: [], locations: [] }}
        searchDemo={false}
        totalCount={1}
      />,
    );

    expect(screen.getByText('Unknown College')).toBeInTheDocument();
    expect(screen.getByText('Emerging')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
