import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { _fill, ...rest } = props;
    return <img {...rest} />;
  },
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

import Article from '../Article';

describe('Article', () => {
  it('renders article card with title and learn more link', () => {
    render(
      <Article
        id='article-1'
        title='Understanding Neurodiversity in Education'
        imageUrl='/images/article.jpg'
        description='A short description'
      />,
    );

    expect(screen.getByText('Understanding Neurodiversity in Education')).toBeInTheDocument();
    expect(
      screen.getByAltText('Thumbnail for Understanding Neurodiversity in Education'),
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/articles/understanding-neurodiversity-in-education',
    );
  });
});
