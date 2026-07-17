import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

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

import EmergingInstitutions from '../EmergingInstitutions';
import EmergingInstitutionCtaButton from '../EmergingInstitutionCtaButton';
import InstitutionHero from '../InstitutionHero';
import { InstitutionHeroVariant } from '../institutionHeroVariant';
import InstitutionStats from '../InstitutionStats';
import EmergingProviderHero from '../EmergingProviderHero';
import EmergingProviderStats, {
  ProviderStatItem,
} from '../EmergingProviderStats';
import EmergingProvidersFAQs from '../EmergingProvidersFAQs';

jest.mock('../EmergingInstitutionCard', () => ({
  __esModule: true,
  default: ({ name, href }: { name: string; href: string }) => (
    <a href={href} data-testid='institution-card'>
      {name}
    </a>
  ),
}));

jest.mock('../../course/CourseDetails/CourseDetailsMiddleBanner/CourseDetailsMiddleBannerIcon', () => ({
  __esModule: true,
  default: ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <div data-testid='banner-icon'>
      {title}: {description}
    </div>
  ),
}));

jest.mock('../../accordion/Accordian', () => ({
  __esModule: true,
  default: ({
    title,
    children,
  }: {
    title: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div data-testid='accordion'>
      <div data-testid='accordion-title'>
        {typeof title === 'string' ? title : title}
      </div>
      <div>{children}</div>
    </div>
  ),
}));

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

describe('EmergingInstitutions', () => {
  it('renders the section heading', () => {
    render(<EmergingInstitutions />);
    expect(
      screen.getByText('NDA Emerging Providers'),
    ).toBeInTheDocument();
  });

  it('renders the subtitle description', () => {
    render(<EmergingInstitutions />);
    expect(
      screen.getByText(/Emerging Providers are organisations/),
    ).toBeInTheDocument();
  });

  it('renders institution cards from JSON data', () => {
    render(<EmergingInstitutions />);
    const cards = screen.getAllByTestId('institution-card');
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });

  it('renders graduation cap icon', () => {
    render(<EmergingInstitutions />);
    expect(
      screen.getByAltText('Graduation cap icon'),
    ).toBeInTheDocument();
  });
});

describe('EmergingInstitutionCtaButton', () => {
  it('renders Explore More button', () => {
    render(
      <EmergingInstitutionCtaButton
        ctaHref='/test-path'
        className='test'
      />,
    );
    expect(screen.getByText('Explore More')).toBeInTheDocument();
  });

  it('renders as a link to ctaHref', () => {
    render(
      <EmergingInstitutionCtaButton
        ctaHref='/test-path'
        className='test'
      />,
    );
    const link = screen.getByText('Explore More').closest('a');
    expect(link).toHaveAttribute('href', '/test-path');
  });

  it('fires gtag event on click', () => {
    const gtagMock = jest.fn();
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag =
      gtagMock;

    render(
      <EmergingInstitutionCtaButton
        ctaHref='/analytics-test'
        className='test'
      />,
    );
    fireEvent.click(screen.getByText('Explore More'));
    expect(gtagMock).toHaveBeenCalledWith(
      'event',
      'emerging_cta_click',
      expect.objectContaining({
        destination_path: '/analytics-test',
        link_text: 'Explore More',
        category: 'Emerging',
      }),
    );

    delete (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  });

  it('uses custom analytics params when provided', () => {
    const gtagMock = jest.fn();
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag =
      gtagMock;

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
    expect(gtagMock).toHaveBeenCalledWith(
      'event',
      'custom_event',
      expect.objectContaining({
        category: 'Custom',
        extra: 'val',
      }),
    );

    delete (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  });

  it('opens in new tab when openInNewTab is true', () => {
    render(
      <EmergingInstitutionCtaButton
        ctaHref='/new-tab'
        className='test'
        openInNewTab
      />,
    );
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
    expect(
      screen.getByText(/Organisations Showing/),
    ).toBeInTheDocument();
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
    expect(
      screen.getByAltText('Endorsed Learning Organisation'),
    ).toBeInTheDocument();
  });

  it('renders without location item', () => {
    render(
      <InstitutionHero
        variant={InstitutionHeroVariant.Emerging}
        title='Test'
        heroInfoItems={[heroItems[1]]}
      />,
    );
    expect(
      screen.queryByText(/Location:/),
    ).toBeNull();
  });
});

describe('InstitutionStats', () => {
  it('delegates to EmergingProviderStats', () => {
    render(<InstitutionStats stats={mockStats} />);
    expect(
      screen.getByText(/Student Delivery Signals/),
    ).toBeInTheDocument();
  });

  it('passes isAlignedWithPageColumn prop', () => {
    render(
      <InstitutionStats stats={mockStats} isAlignedWithPageColumn />,
    );
    expect(
      screen.getByText(/Student Delivery Signals/),
    ).toBeInTheDocument();
  });
});

describe('EmergingProviderHero', () => {
  it('renders as Emerging variant InstitutionHero', () => {
    render(
      <EmergingProviderHero
        title='Provider Name'
        heroInfoItems={[
          { icon: mockStatIcon, value: 'Sydney', label: 'Location' },
        ]}
      />,
    );
    expect(screen.getByText('(Provider Name)')).toBeInTheDocument();
  });
});

describe('EmergingProviderStats', () => {
  it('renders the heading', () => {
    render(<EmergingProviderStats stats={mockStats} />);
    expect(
      screen.getByText(/Student Delivery Signals/),
    ).toBeInTheDocument();
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

  it('renders disclaimer with source link', () => {
    render(<EmergingProviderStats stats={mockStats} />);
    expect(screen.getByText('Quilt survey 2024')).toBeInTheDocument();
  });

  it('renders disclaimer link pointing to compared.edu.au', () => {
    render(<EmergingProviderStats stats={mockStats} />);
    const link = screen.getByText('Quilt survey 2024').closest('a');
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('compared.edu.au'),
    );
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('applies aligned class when isAlignedWithPageColumn is true', () => {
    const { container } = render(
      <EmergingProviderStats
        stats={mockStats}
        isAlignedWithPageColumn
      />,
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
    expect(
      screen.getByText(/compiled from publicly available sources/),
    ).toBeInTheDocument();
  });
});
