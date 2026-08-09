import React from 'react';
import { render, screen } from '@testing-library/react';

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

jest.mock('../../badges/BadgeDisplay', () => ({
  __esModule: true,
  default: () => <div data-testid='badge-display'>Badges</div>,
}));

jest.mock('../../providerSearch/ProviderStudySearch', () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <div data-testid='provider-study-search' className={className}>
      Provider search
    </div>
  ),
}));

import HomeBanner from '../HomeBanner';

describe('HomeBanner', () => {
  it('renders default title when none provided', () => {
    render(<HomeBanner />);
    expect(screen.getByText(/We endorse Neuro-inclusion/)).toBeInTheDocument();
  });

  it('renders default subtitle when none provided', () => {
    render(<HomeBanner />);
    expect(screen.getByText(/Reach out to learn more/)).toBeInTheDocument();
  });

  it('renders custom title and subtitle', () => {
    render(<HomeBanner title='Custom Title' subtitle='Custom Subtitle' />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  it('renders badges when displayBadges is true', () => {
    render(<HomeBanner displayBadges />);
    expect(screen.getByTestId('badge-display')).toBeInTheDocument();
  });

  it('does not render badges when displayBadges is false', () => {
    render(<HomeBanner displayBadges={false} />);
    expect(screen.queryByTestId('badge-display')).not.toBeInTheDocument();
  });

  it('renders Learn More button when showButton is true', () => {
    render(<HomeBanner showButton />);
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('does not render Learn More button when showButton is false', () => {
    render(<HomeBanner showButton={false} />);
    expect(screen.queryByText('Learn More')).not.toBeInTheDocument();
  });

  it('renders Learn More as link to /endorsements', () => {
    render(<HomeBanner showButton />);
    const link = screen.getByText('Learn More').closest('a');
    expect(link).toHaveAttribute('href', '/endorsements');
  });

  it('renders a single provider search when showSearchBar and displayFilter are true', () => {
    render(<HomeBanner showSearchBar displayFilter />);
    const filters = screen.getAllByTestId('provider-study-search');
    expect(filters).toHaveLength(1);
  });

  it('places provider search above the hero title when enabled', () => {
    const { container } = render(<HomeBanner showSearchBar displayFilter title='Hero Title' />);
    const search = screen.getByTestId('provider-study-search');
    const title = screen.getByText('Hero Title');
    const banner = container.querySelector('.home-hero-banner');
    expect(banner?.contains(search)).toBe(true);
    expect(Boolean(search.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(
      true,
    );
  });

  it('does not render provider search when showSearchBar is false', () => {
    render(<HomeBanner showSearchBar={false} displayFilter />);
    expect(screen.queryByTestId('provider-study-search')).not.toBeInTheDocument();
  });
});
