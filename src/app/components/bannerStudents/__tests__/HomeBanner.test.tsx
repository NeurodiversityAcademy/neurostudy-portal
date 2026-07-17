import React from 'react';
import { render, screen } from '@testing-library/react';

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

jest.mock('../../badges/BadgeDisplay', () => ({
  __esModule: true,
  default: () => <div data-testid='badge-display'>Badges</div>,
}));

jest.mock('../../course/CoursePrimaryFilter', () => ({
  __esModule: true,
  default: ({ className }: { className: string }) => (
    <div data-testid='course-filter' className={className}>
      Filter
    </div>
  ),
}));

jest.mock('@/app/utilities/course/CourseProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import HomeBanner from '../HomeBanner';

describe('HomeBanner (students)', () => {
  it('renders default title when none provided', () => {
    render(<HomeBanner />);
    expect(screen.getByText(/We endorse Neuro-inclusion/)).toBeInTheDocument();
  });

  it('renders default subtitle when none provided', () => {
    render(<HomeBanner />);
    expect(screen.getByText(/Reach out to learn more/)).toBeInTheDocument();
  });

  it('renders custom title and subtitle', () => {
    render(<HomeBanner title='Student Title' subtitle='Student Subtitle' />);
    expect(screen.getByText('Student Title')).toBeInTheDocument();
    expect(screen.getByText('Student Subtitle')).toBeInTheDocument();
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

  it('renders Learn More as link to /endorsements', () => {
    render(<HomeBanner showButton />);
    const link = screen.getByText('Learn More').closest('a');
    expect(link).toHaveAttribute('href', '/endorsements');
  });

  it('renders course filter when showSearchBar and displayFilter are true', () => {
    render(<HomeBanner showSearchBar displayFilter />);
    const filters = screen.getAllByTestId('course-filter');
    expect(filters.length).toBeGreaterThanOrEqual(1);
  });

  it('does not render course filter when showSearchBar is false', () => {
    render(<HomeBanner showSearchBar={false} displayFilter />);
    expect(screen.queryByTestId('course-filter')).not.toBeInTheDocument();
  });
});
