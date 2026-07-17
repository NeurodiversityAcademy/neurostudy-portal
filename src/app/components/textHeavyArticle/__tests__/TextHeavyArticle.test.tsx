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

jest.mock('@/app/hooks/useWindowWidth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/utilities/sanitizeHtml', () => ({
  __esModule: true,
  sanitizeHtml: (html: string) => html ?? '',
}));

import useWindowWidth from '@/app/hooks/useWindowWidth';
import TextHeavyArticle from '../TextHeavyArticle';

const mockUseWindowWidth = useWindowWidth as jest.Mock;

const defaultProps = {
  id: '1',
  header: 'Test Article Header',
  imageUrl: '/test-image.jpg',
  bodyText: 'First paragraph\nSecond paragraph',
  authorName: 'Jane Author',
  authorImageUrl: '/author.jpg',
};

describe('TextHeavyArticle', () => {
  beforeEach(() => {
    mockUseWindowWidth.mockReturnValue(1024);
  });

  it('renders breadcrumb links and header', () => {
    render(<TextHeavyArticle {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Articles' })).toHaveAttribute('href', '/articles');
    expect(screen.getByText('Test Article Header')).toBeInTheDocument();
  });

  it('renders article image', () => {
    render(<TextHeavyArticle {...defaultProps} />);
    expect(screen.getByAltText('image for Test Article Header')).toBeInTheDocument();
  });

  it('renders body paragraphs', () => {
    render(<TextHeavyArticle {...defaultProps} />);
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('renders author block when author details are provided', () => {
    render(<TextHeavyArticle {...defaultProps} />);
    expect(screen.getByText('Jane Author')).toBeInTheDocument();
    expect(screen.getByAltText('Author Image: Jane Author')).toBeInTheDocument();
  });

  it('does not render author block when author details are missing', () => {
    render(
      <TextHeavyArticle {...defaultProps} authorName={undefined} authorImageUrl={undefined} />,
    );
    expect(screen.queryByText('Jane Author')).not.toBeInTheDocument();
  });

  it('uses smaller breadcrumb typography on narrow screens', () => {
    mockUseWindowWidth.mockReturnValue(400);
    render(<TextHeavyArticle {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });
});
