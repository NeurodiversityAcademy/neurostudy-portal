import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('../article/card', () => ({
  __esModule: true,
  default: () => <div data-testid='article-card-list'>Article cards</div>,
}));

jest.mock('../wrapper/BlogCardListWrapper', () => ({
  __esModule: true,
  default: () => <div data-testid='blog-card-list'>Blog cards</div>,
}));

jest.mock('../exploreMore/ExploreMore', () => ({
  __esModule: true,
  default: ({ dest }: { dest: string }) => (
    <a href={dest}>Explore more</a>
  ),
}));

import ArticleList from '../articleList/articleList';
import BlogList from '../blogList/blogList';
import Fact from '../fact/Fact';

describe('ArticleList', () => {
  it('renders article list section', () => {
    render(<ArticleList />);
    expect(
      screen.getByText('Explore Neurodiversity Academy'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('article-card-list')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore more' })).toHaveAttribute(
      'href',
      '/articles',
    );
  });
});

describe('BlogList', () => {
  it('renders blog list section', () => {
    render(<BlogList />);
    expect(
      screen.getByText('Explore Neurodivergent Mates'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('blog-card-list')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore more' })).toHaveAttribute(
      'href',
      '/blogs',
    );
  });
});

describe('Fact', () => {
  it('renders neurodiversity statistics', () => {
    render(<Fact />);
    expect(
      screen.getByText('Neurodiversity in Adult Education'),
    ).toBeInTheDocument();
    expect(screen.getByText('66%')).toBeInTheDocument();
    expect(screen.getByText('27%')).toBeInTheDocument();
    expect(screen.getByText('56%')).toBeInTheDocument();
    expect(
      screen.getByText('*People with Disability in Australia 2022'),
    ).toBeInTheDocument();
  });
});
