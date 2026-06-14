import { fireEvent, render } from '@testing-library/react';
import EndorsedInstitutionCoverHero from '../EndorsedInstitutionCoverHero';
import {
  GA_EVENT_COMMAND,
  installGtagMock,
  installTestPagePath,
} from '@/app/utilities/__tests__/gaTestHelpers';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

jest.mock(
  '@/app/components/course/CourseDetails/CourseDetailsMiddleBanner/CourseDetailsMiddleBannerIcon',
  () => ({
    __esModule: true,
    default: ({
      title,
      description,
    }: {
      title: string;
      description: string;
    }) => (
      <div>
        {title}: {description}
      </div>
    ),
  })
);

describe('EndorsedInstitutionCoverHero analytics', () => {
  const baseProps = {
    backgroundSrc: '/test-banner.jpg',
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
      <EndorsedInstitutionCoverHero {...baseProps} coursesUrl={coursesUrl} />
    );

    fireEvent.click(getByRole('link', { name: 'Explore' }));

    expect(mockGtag).toHaveBeenCalledWith(
      GA_EVENT_COMMAND,
      'endorsed_explore_click',
      {
        destination_url: coursesUrl,
        page_path: '/endorsedproviders/collarts',
        provider_slug: 'collarts',
        link_text: 'Explore',
        category: 'Endorsed',
      }
    );
  });

  it('does not render Explore link when coursesUrl is absent', () => {
    const mockGtag = installGtagMock();
    const { queryByRole } = render(
      <EndorsedInstitutionCoverHero {...baseProps} />
    );

    expect(queryByRole('link', { name: 'Explore' })).not.toBeInTheDocument();
    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('preserves href and target on Explore link', () => {
    const coursesUrl = 'https://example.com/courses';
    const { getByRole } = render(
      <EndorsedInstitutionCoverHero {...baseProps} coursesUrl={coursesUrl} />
    );

    const link = getByRole('link', { name: 'Explore' });
    expect(link).toHaveAttribute('href', coursesUrl);
    expect(link).toHaveAttribute('target', '_blank');
  });
});
