import { fireEvent, render } from '@testing-library/react';
import EndorsedInstitutionCoverHero from '../EndorsedInstitutionCoverHero';
import {
  GA_EVENT_COMMAND,
  installGtagMock,
  installTestPagePath,
} from '@/app/utilities/__tests__/gaTestHelpers';
import { NDA_CERTIFIED_LEGEND } from '@/app/utilities/endorsedProvidersDemo';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

jest.mock(
  '@/app/components/course/CourseDetails/CourseDetailsMiddleBanner/CourseDetailsMiddleBannerIcon',
  () => ({
    __esModule: true,
    default: ({ title, description }: { title: string; description: string }) => (
      <div>
        {title}: {description}
      </div>
    ),
  }),
);

describe('EndorsedInstitutionCoverHero analytics', () => {
  const baseProps = {
    locationValue: 'Melbourne',
    typeValue: 'Higher Education',
    providerSlug: 'collarts',
  };

  beforeEach(() => {
    installGtagMock();
    installTestPagePath('/endorsedproviders/collarts');
  });

  it('fires endorsed_explore_click when Explore link is clicked', () => {
    const mockGtag = installGtagMock();
    const coursesUrl = 'https://example.com/courses';
    const { getByRole } = render(
      <EndorsedInstitutionCoverHero {...baseProps} coursesUrl={coursesUrl} />,
    );

    fireEvent.click(getByRole('link', { name: 'Explore' }));

    expect(mockGtag).toHaveBeenCalledWith(GA_EVENT_COMMAND, 'endorsed_explore_click', {
      destination_url: coursesUrl,
      page_path: '/endorsedproviders/collarts',
      provider_slug: 'collarts',
      link_text: 'Explore',
      category: 'Endorsed',
    });
  });

  it('does not render Explore link when coursesUrl is absent', () => {
    const mockGtag = installGtagMock();
    const { queryByRole } = render(<EndorsedInstitutionCoverHero {...baseProps} />);

    expect(queryByRole('link', { name: 'Explore' })).not.toBeInTheDocument();
    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('preserves href and target on Explore link', () => {
    const coursesUrl = 'https://example.com/courses';
    const { getByRole } = render(
      <EndorsedInstitutionCoverHero {...baseProps} coursesUrl={coursesUrl} />,
    );

    const link = getByRole('link', { name: 'Explore' });
    expect(link).toHaveAttribute('href', coursesUrl);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('shows NDA certified legend below the meta strip when certified', () => {
    const { getByText, getByRole } = render(
      <EndorsedInstitutionCoverHero {...baseProps} ndaCertified />,
    );

    const legend = getByText(NDA_CERTIFIED_LEGEND);
    expect(legend).toBeInTheDocument();

    const section = getByRole('region', { name: 'Endorsed provider cover' });
    const metaStripWrap = section.lastElementChild;
    const metaStrip = metaStripWrap?.firstElementChild;
    expect(metaStrip).not.toBeNull();
    expect(metaStrip?.contains(legend)).toBe(false);
    expect(metaStripWrap?.contains(legend)).toBe(true);
  });

  it('does not show NDA certified legend when not certified', () => {
    const { queryByText } = render(
      <EndorsedInstitutionCoverHero {...baseProps} ndaCertified={false} />,
    );

    expect(queryByText(NDA_CERTIFIED_LEGEND)).not.toBeInTheDocument();
  });
});
