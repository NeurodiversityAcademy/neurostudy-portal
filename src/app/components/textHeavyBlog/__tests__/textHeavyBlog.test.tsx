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

jest.mock('isomorphic-dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: (html: string) => html,
  },
}));

import useWindowWidth from '@/app/hooks/useWindowWidth';
import TextHeavyBlog from '../textHeavyBlog';

const mockUseWindowWidth = useWindowWidth as jest.Mock;

const defaultProps = {
  id: '1',
  header: 'Test Blog Header',
  imageUrl: '/test-blog-image.jpg',
  bodyText: 'Blog paragraph one\nBlog paragraph two',
};

describe('TextHeavyBlog', () => {
  beforeEach(() => {
    mockUseWindowWidth.mockReturnValue(1024);
  });

  it('renders breadcrumb links and header', () => {
    render(<TextHeavyBlog {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Blogs' })).toHaveAttribute('href', '/blogs');
    expect(screen.getByText('Test Blog Header')).toBeInTheDocument();
  });

  it('renders blog image', () => {
    render(<TextHeavyBlog {...defaultProps} />);
    expect(screen.getByAltText('image for Test Blog Header')).toBeInTheDocument();
  });

  it('renders body paragraphs', () => {
    render(<TextHeavyBlog {...defaultProps} />);
    expect(screen.getByText('Blog paragraph one')).toBeInTheDocument();
    expect(screen.getByText('Blog paragraph two')).toBeInTheDocument();
  });

  it('uses smaller breadcrumb typography on narrow screens', () => {
    mockUseWindowWidth.mockReturnValue(400);
    render(<TextHeavyBlog {...defaultProps} />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });
});
