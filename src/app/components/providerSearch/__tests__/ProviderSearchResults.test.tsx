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
  }: {
    center: React.ReactNode;
    ctaHref?: string;
    comingSoonLabel?: string;
  }) => (
    <div data-testid='provider-card'>
      <div>{center}</div>
      {ctaHref ? <a href={ctaHref}>Explore More</a> : <span>{comingSoonLabel}</span>}
    </div>
  ),
}));

jest.mock('../../emergingInstitutions/EmergingInstitutionCard', () => ({
  __esModule: true,
  default: ({ name, state }: { name: string; state: string }) => (
    <div data-testid='emerging-card'>
      <span>{name}</span>
      <span>{state}</span>
      <a href={`/emergingproviders/${name.toLowerCase().replace(/\s+/g, '-')}`}>Explore More</a>
    </div>
  ),
}));

jest.mock('../../endorsedProviders/EndorsedCertifiedBadge', () => ({
  __esModule: true,
  default: () => <div>badge</div>,
}));

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

const emptyResults = (): ProviderSearchTierResults => ({
  course_endorsed: [],
  starred_endorsed: [],
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
    results.starred_endorsed = [
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
    expect(screen.getByText('NDA Certified providers')).toBeInTheDocument();
    expect(screen.getByText('Emerging providers')).toBeInTheDocument();
    expect(screen.getByText('Jazz Music Institute')).toBeInTheDocument();
    expect(screen.getByText('QLD')).toBeInTheDocument();
    expect(screen.getAllByTestId('provider-card')).toHaveLength(2);
    expect(screen.getAllByTestId('emerging-card')).toHaveLength(1);
    expect(screen.getAllByRole('link', { name: 'Explore More' })[0]).toHaveAttribute(
      'href',
      '/endorsedproviders/collarts/courses?searchDemo=1',
    );
    expect(screen.queryByText(/Explore emerging providers/i)).not.toBeInTheDocument();
  });
});
