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

jest.mock('../../endorsedProviders/EndorsedCertifiedBadge', () => ({
  __esModule: true,
  default: () => <div>badge</div>,
}));

jest.mock('../../buttons/ActionButton', () => ({
  __esModule: true,
  default: ({ label, to }: { label: string; to?: string }) => <a href={to}>{label}</a>,
}));

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

const emptyResults = (): ProviderSearchTierResults => ({
  course_endorsed: [],
  starred_endorsed: [],
  endorsed: [],
  emerging: [],
});

describe('ProviderSearchResults', () => {
  it('renders empty state with emerging directory CTA', () => {
    render(
      <ProviderSearchResults
        results={emptyResults()}
        filters={{ interestAreas: ['Music'], locations: [] }}
        searchDemo={false}
        totalCount={0}
      />,
    );

    expect(screen.getByText('No providers matched your search')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore emerging providers' })).toHaveAttribute(
      'href',
      '/emergingproviders',
    );
  });

  it('renders tier headings and course-endorsed href', () => {
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

    render(
      <ProviderSearchResults
        results={results}
        filters={{ interestAreas: ['Music'], locations: ['Sydney'] }}
        searchDemo
        totalCount={2}
      />,
    );

    expect(screen.getByText('Courses from endorsed providers')).toBeInTheDocument();
    expect(screen.getByText('NDA Certified providers')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Explore More' })[0]).toHaveAttribute(
      'href',
      '/endorsedproviders/collarts/courses?searchDemo=1',
    );
    expect(screen.getByRole('link', { name: 'Explore emerging providers' })).toBeInTheDocument();
  });
});
