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

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/test',
}));

import Blog from '../Blog';

describe('Blog', () => {
  it('renders blog card with title and learn more link', () => {
    render(
      <Blog
        id='blog-1'
        title='Neurodiversity and Inclusive Workplaces'
        imageUrl='/images/blog.jpg'
        description='A short description'
      />,
    );

    expect(screen.getByText('Neurodiversity and Inclusive Workplaces')).toBeInTheDocument();
    expect(
      screen.getByAltText('Thumbnail for Neurodiversity and Inclusive Workplaces'),
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/blogs/neurodiversity-and-inclusive-workplaces',
    );
  });
});
