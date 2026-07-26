import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/test',
}));

jest.mock('../emergingProvidersGa', () => ({
  VIEW_ALL_LINK_TEXT: 'View all emerging providers',
  buildEmergingDirectoryViewAllAnalytics: () => ({
    eventName: 'emerging_directory_cta_click',
    category: 'Emerging',
    fileName: 'emergingproviders',
    params: {
      surface: 'homepage_teaser',
      destination_path: '/emergingproviders',
      link_text: 'View all emerging providers',
    },
  }),
  trackEmergingStateAutoSelect: jest.fn(),
  trackEmergingStateSelect: jest.fn(),
  trackEmergingInstitutePillClick: jest.fn(),
}));

jest.mock('@/app/utilities/gaTracking', () => ({
  sendGaEvent: jest.fn(),
}));

jest.mock(
  '../../course/CourseDetails/CourseDetailsMiddleBanner/CourseDetailsMiddleBannerIcon',
  () => ({
    __esModule: true,
    default: ({ title, description }: { title: string; description: string }) => (
      <div data-testid='banner-icon'>
        {title}: {description}
      </div>
    ),
  }),
);

jest.mock('../../accordion/Accordian', () => require('@/testUtils/mockAccordion'));

import EmergingInstitutions from '../EmergingInstitutions';
import EmergingInstitutionCtaButton from '../EmergingInstitutionCtaButton';
import InstitutionHero from '../InstitutionHero';
import { InstitutionHeroVariant } from '../institutionHeroVariant';
import InstitutionStats from '../InstitutionStats';
import EmergingProviderHero from '../EmergingProviderHero';
import EmergingProviderStats, { ProviderStatItem } from '../EmergingProviderStats';
import EmergingProvidersFAQs from '../EmergingProvidersFAQs';
import {
  trackEmergingInstitutePillClick,
  trackEmergingStateAutoSelect,
  trackEmergingStateSelect,
} from '../emergingProvidersGa';
import { sendGaEvent } from '@/app/utilities/gaTracking';

const mockStatIcon = {
  src: '/test.png',
  width: 100,
  height: 100,
} as unknown as import('next/image').StaticImageData;

const mockStats: ProviderStatItem[] = [
  {
    icon: mockStatIcon,
    value: '92%',
    title: 'Overall Experience',
    nationalAverage: '78%',
    responses: '150',
  },
  {
    icon: mockStatIcon,
    value: '88%',
    title: 'Skills Development',
    nationalAverage: '75%',
    responses: '120',
  },
];

const trackAutoSelectMock = trackEmergingStateAutoSelect as jest.MockedFunction<
  typeof trackEmergingStateAutoSelect
>;
const trackStateSelectMock = trackEmergingStateSelect as jest.MockedFunction<
  typeof trackEmergingStateSelect
>;
const trackInstitutePillMock = trackEmergingInstitutePillClick as jest.MockedFunction<
  typeof trackEmergingInstitutePillClick
>;

describe('EmergingInstitutions', () => {
  beforeEach(() => {
    trackAutoSelectMock.mockClear();
    trackStateSelectMock.mockClear();
    trackInstitutePillMock.mockClear();
  });

  it('renders the section heading and state pills', async () => {
    render(<EmergingInstitutions />);
    expect(screen.getByText('NDA Emerging Providers')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'NSW' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'QLD' })).toBeInTheDocument();
    await waitFor(() => {
      expect(trackAutoSelectMock).toHaveBeenCalled();
    });
  });

  it('auto-selects a state and shows institute pills', async () => {
    render(<EmergingInstitutions />);
    await waitFor(() => {
      expect(trackAutoSelectMock).toHaveBeenCalled();
    });
    expect(screen.getByLabelText(/emerging providers$/i)).toBeInTheDocument();
  });

  it('fires state select GA and swaps institutes when another state is tapped', async () => {
    render(<EmergingInstitutions />);
    await waitFor(() => expect(trackAutoSelectMock).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: 'QLD' }));

    expect(trackStateSelectMock).toHaveBeenCalledWith(
      expect.objectContaining({ state: 'QLD' }),
    );
    expect(screen.getByText('Bond University')).toBeInTheDocument();
  });

  it('re-tapping the selected state still fires GA with was_already_selected', async () => {
    render(<EmergingInstitutions />);
    await waitFor(() => expect(trackAutoSelectMock).toHaveBeenCalled());

    const selectedState = trackAutoSelectMock.mock.calls[0]?.[0];
    expect(selectedState).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: selectedState! }));
    expect(trackStateSelectMock).toHaveBeenCalledWith({
      state: selectedState,
      wasAlreadySelected: true,
    });
  });

  it('opens live institute pills in the same tab and tracks click', async () => {
    render(<EmergingInstitutions />);
    await waitFor(() => expect(trackAutoSelectMock).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: 'QLD' }));
    const bondLink = screen.getByRole('link', { name: 'Bond University' });
    expect(bondLink).not.toHaveAttribute('target', '_blank');
    expect(bondLink).toHaveAttribute('href', '/emergingproviders/bond-university');

    fireEvent.click(bondLink);
    expect(trackInstitutePillMock).toHaveBeenCalledWith(
      expect.objectContaining({
        providerName: 'Bond University',
        providerSlug: 'bond-university',
        state: 'QLD',
      }),
    );
  });

  it('only shows state pills for states that have live providers', async () => {
    render(<EmergingInstitutions />);
    await waitFor(() => expect(trackAutoSelectMock).toHaveBeenCalled());

    expect(screen.getByRole('button', { name: 'NSW' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'QLD' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SA' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VIC' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'WA' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ACT' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'TAS' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'NT' })).not.toBeInTheDocument();
  });

  it('links View all to the directory', async () => {
    render(<EmergingInstitutions />);
    await waitFor(() => expect(trackAutoSelectMock).toHaveBeenCalled());
    const link = screen.getByText('View all emerging providers').closest('a');
    expect(link).toHaveAttribute('href', '/emergingproviders');
  });

  it('renders graduation cap icon', () => {
    render(<EmergingInstitutions />);
    expect(screen.getByAltText('Graduation cap icon')).toBeInTheDocument();
  });
});

describe('EmergingInstitutionCtaButton', () => {
  beforeEach(() => {
    (sendGaEvent as jest.Mock).mockClear();
  });

  it('renders Explore More button', () => {
    render(<EmergingInstitutionCtaButton ctaHref='/test-path' className='test' />);
    expect(screen.getByText('Explore More')).toBeInTheDocument();
  });

  it('renders as a link to ctaHref', () => {
    render(<EmergingInstitutionCtaButton ctaHref='/test-path' className='test' />);
    const link = screen.getByText('Explore More').closest('a');
    expect(link).toHaveAttribute('href', '/test-path');
  });

  it('fires sendGaEvent on click', () => {
    render(<EmergingInstitutionCtaButton ctaHref='/analytics-test' className='test' />);
    fireEvent.click(screen.getByText('Explore More'));
    expect(sendGaEvent).toHaveBeenCalledWith(
      'emerging_cta_click',
      expect.objectContaining({
        destination_path: '/analytics-test',
        link_text: 'Explore More',
        category: 'Emerging',
      }),
    );
  });

  it('uses custom analytics params when provided', () => {
    render(
      <EmergingInstitutionCtaButton
        ctaHref='/custom'
        className='test'
        analytics={{
          eventName: 'custom_event',
          category: 'Custom',
          params: { extra: 'val' },
        }}
      />,
    );
    fireEvent.click(screen.getByText('Explore More'));
    expect(sendGaEvent).toHaveBeenCalledWith(
      'custom_event',
      expect.objectContaining({
        category: 'Custom',
        extra: 'val',
      }),
    );
  });

  it('opens in new tab when openInNewTab is true', () => {
    render(<EmergingInstitutionCtaButton ctaHref='/new-tab' className='test' openInNewTab />);
    const link = screen.getByText('Explore More').closest('a');
    expect(link).toHaveAttribute('target', '_blank');
  });
});

describe('InstitutionHero', () => {
  const heroItems = [
    { icon: mockStatIcon, value: 'Melbourne', label: 'Location' },
    { icon: mockStatIcon, value: 'University', label: 'Type' },
  ];

  it('renders the title', () => {
    render(
      <InstitutionHero
        variant={InstitutionHeroVariant.Emerging}
        title='Test University'
        heroInfoItems={heroItems}
      />,
    );
    expect(screen.getByText('(Test University)')).toBeInTheDocument();
  });

  it('renders Emerging tagline for Emerging variant', () => {
    render(
      <InstitutionHero
        variant={InstitutionHeroVariant.Emerging}
        title='Test'
        heroInfoItems={heroItems}
      />,
    );
    expect(screen.getByText(/Organisations Showing/)).toBeInTheDocument();
  });

  it('renders Endorsed tagline for Endorsed variant', () => {
    render(
      <InstitutionHero
        variant={InstitutionHeroVariant.Endorsed}
        title='Test'
        heroInfoItems={heroItems}
      />,
    );
    expect(screen.getByText(/NDA Endorsed/)).toBeInTheDocument();
  });

  it('renders location and type banner icons', () => {
    render(
      <InstitutionHero
        variant={InstitutionHeroVariant.Emerging}
        title='Test'
        heroInfoItems={heroItems}
      />,
    );
    expect(screen.getByText('Location: Melbourne')).toBeInTheDocument();
    expect(screen.getByText('Type: University')).toBeInTheDocument();
  });

  it('renders Emerging Providers badge for Emerging variant', () => {
    render(
      <InstitutionHero
        variant={InstitutionHeroVariant.Emerging}
        title='Test'
        heroInfoItems={heroItems}
      />,
    );
    expect(screen.getByAltText('Emerging Providers')).toBeInTheDocument();
  });

  it('renders Endorsed badge for Endorsed variant', () => {
    render(
      <InstitutionHero
        variant={InstitutionHeroVariant.Endorsed}
        title='Test'
        heroInfoItems={heroItems}
      />,
    );
    expect(screen.getByAltText('Endorsed Learning Organisation')).toBeInTheDocument();
  });

  it('renders without location item', () => {
    render(
      <InstitutionHero
        variant={InstitutionHeroVariant.Emerging}
        title='Test'
        heroInfoItems={[heroItems[1]]}
      />,
    );
    expect(screen.queryByText(/Location:/)).not.toBeInTheDocument();
  });
});

describe('InstitutionStats', () => {
  it('delegates to EmergingProviderStats', () => {
    render(<InstitutionStats stats={mockStats} />);
    expect(screen.getByText(/Student Delivery Signals/)).toBeInTheDocument();
  });

  it('passes isAlignedWithPageColumn prop', () => {
    render(<InstitutionStats stats={mockStats} isAlignedWithPageColumn />);
    expect(screen.getByText(/Student Delivery Signals/)).toBeInTheDocument();
  });
});

describe('EmergingProviderHero', () => {
  it('renders as Emerging variant InstitutionHero', () => {
    render(
      <EmergingProviderHero
        title='Provider Name'
        heroInfoItems={[{ icon: mockStatIcon, value: 'Sydney', label: 'Location' }]}
      />,
    );
    expect(screen.getByText('(Provider Name)')).toBeInTheDocument();
  });
});

describe('EmergingProviderStats', () => {
  it('renders the heading', () => {
    render(<EmergingProviderStats stats={mockStats} />);
    expect(screen.getByText(/Student Delivery Signals/)).toBeInTheDocument();
  });

  it('renders stat cards', () => {
    render(<EmergingProviderStats stats={mockStats} />);
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();
  });

  it('renders stat titles', () => {
    render(<EmergingProviderStats stats={mockStats} />);
    expect(screen.getByText('Overall Experience')).toBeInTheDocument();
    expect(screen.getByText('Skills Development')).toBeInTheDocument();
  });

  it('renders national averages', () => {
    render(<EmergingProviderStats stats={mockStats} />);
    expect(screen.getByText('National Average 78%')).toBeInTheDocument();
    expect(screen.getByText('National Average 75%')).toBeInTheDocument();
  });

  it('renders responses', () => {
    render(<EmergingProviderStats stats={mockStats} />);
    const responses = screen.getAllByText(/Responses/);
    expect(responses.length).toBeGreaterThanOrEqual(2);
  });

  it('renders disclaimer with QILT source label', () => {
    render(<EmergingProviderStats stats={mockStats} />);
    expect(screen.getByText(/QILT survey 2024/)).toBeInTheDocument();
  });

  it('renders plain-text QILT label when sourceHref is omitted', () => {
    render(<EmergingProviderStats stats={mockStats} />);
    expect(screen.queryByRole('link', { name: 'QILT survey 2024' })).not.toBeInTheDocument();
    expect(screen.getByText(/QILT survey 2024/)).toBeInTheDocument();
  });

  it('renders disclaimer link when sourceHref is provided', () => {
    const sourceHref =
      'https://www.compared.edu.au/institution/bond-university/undergraduate';
    render(<EmergingProviderStats stats={mockStats} sourceHref={sourceHref} />);
    const link = screen.getByRole('link', { name: 'QILT survey 2024' });
    expect(link).toHaveAttribute('href', sourceHref);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('applies aligned class when isAlignedWithPageColumn is true', () => {
    const { container } = render(
      <EmergingProviderStats stats={mockStats} isAlignedWithPageColumn />,
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});

describe('EmergingProvidersFAQs', () => {
  it('renders FAQ accordions', () => {
    render(<EmergingProvidersFAQs />);
    expect(screen.getByText('Who are Emerging Providers?')).toBeInTheDocument();
    expect(screen.getByText('Why these areas?')).toBeInTheDocument();
  });

  it('renders QILT area table', () => {
    render(<EmergingProvidersFAQs />);
    const matches = screen.getAllByText('Overall student experience');
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Skills development').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Teaching practices').length).toBeGreaterThanOrEqual(1);
  });

  it('renders evidence sources', () => {
    render(<EmergingProvidersFAQs />);
    expect(screen.getByText('Provider website')).toBeInTheDocument();
    expect(screen.getByText('QILT survey data')).toBeInTheDocument();
  });

  it('renders disclaimer accordion', () => {
    render(<EmergingProvidersFAQs />);
    expect(screen.getByText(/compiled from publicly available sources/)).toBeInTheDocument();
  });
});
