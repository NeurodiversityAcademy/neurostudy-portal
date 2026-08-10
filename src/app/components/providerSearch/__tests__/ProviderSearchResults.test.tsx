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
  }: {
    center: React.ReactNode;
    ctaHref?: string;
    comingSoonLabel?: string;
    gaEvent?: { eventName: string; params: { provider_slug?: string; result_position?: number } };
  }) => (
    <div data-testid='provider-card'>
      <div>{center}</div>
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
  }: {
    name: string;
    state: string;
    gaEvent?: { params: { destination_url?: string; provider_slug?: string } };
  }) => (
    <div data-testid='emerging-card'>
      <span>{name}</span>
      <span>{state}</span>
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
      />,
    );

    expect(screen.getByText('Providers with courses')).toBeInTheDocument();
    expect(screen.getByText('Endorsed providers')).toBeInTheDocument();
    expect(screen.getAllByText('NDA ENDORSED')).toHaveLength(2);
    expect(screen.getByText('EXPLORING')).toBeInTheDocument();
    expect(screen.getByText('Neuro-inclusive institutions verified by NDA')).toBeInTheDocument();
    expect(screen.getByText('Building neuro-inclusion — not yet endorsed')).toBeInTheDocument();
    expect(screen.queryByText('NDA Certified providers')).not.toBeInTheDocument();
    expect(screen.getByText('Emerging providers')).toBeInTheDocument();
    expect(screen.getByText('Jazz Music Institute')).toBeInTheDocument();
    expect(screen.getByText('QLD')).toBeInTheDocument();
    expect(screen.getAllByTestId('provider-card')).toHaveLength(2);
    expect(screen.getAllByTestId('emerging-card')).toHaveLength(1);

    const links = screen.getAllByRole('link', { name: 'Explore More' });
    expect(links[0]).toHaveAttribute(
      'href',
      '/endorsedproviders/collarts/courses?searchDemo=1',
    );
    expect(links[0]).toHaveAttribute('data-slug', 'collarts');
    expect(links[1]).toHaveAttribute('href', expect.stringContaining('nepean'));
    expect(links[1]).toHaveAttribute('data-slug', 'nepean-community-college');
    expect(links[2]).toHaveAttribute('href', '/emergingproviders/jazz-music-institute');
    expect(links[2]).toHaveAttribute('data-slug', 'jazz-music-institute');
    expect(screen.queryByText(/Explore emerging providers/i)).not.toBeInTheDocument();
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
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
