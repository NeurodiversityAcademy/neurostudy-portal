import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReadonlyURLSearchParams } from 'next/navigation';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('../Blog', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid='blog-card'>{title}</div>,
}));

import BlogCardList from '../BlogCardList';

const createSearchParams = (params: Record<string, string>) =>
  new URLSearchParams(params) as unknown as ReadonlyURLSearchParams;

describe('BlogCardList', () => {
  it('renders up to three blog cards', () => {
    render(<BlogCardList searchParams={createSearchParams({})} visitedBlogIds={[]} />);
    expect(screen.getAllByTestId('blog-card')).toHaveLength(3);
  });

  it('excludes the current blog from the title query param', () => {
    render(
      <BlogCardList
        searchParams={createSearchParams({
          title: 'neurodiversity-and-safety-creating-inclusive-workplaces-for-diverse-thinkers',
        })}
        visitedBlogIds={[]}
      />,
    );
    const titles = screen.getAllByTestId('blog-card').map((el) => el.textContent);
    expect(titles).not.toContain(
      'Neurodiversity and Safety - Creating Inclusive Workplaces for Diverse Thinkers',
    );
  });

  it('excludes visited blogs', () => {
    render(<BlogCardList searchParams={createSearchParams({})} visitedBlogIds={['1', '2', '3']} />);
    const titles = screen.getAllByTestId('blog-card').map((el) => el.textContent);
    expect(titles).not.toContain(
      'Neurodiversity and Safety - Creating Inclusive Workplaces for Diverse Thinkers',
    );
  });

  it('fills remaining slots when fewer than three unvisited blogs remain', () => {
    render(
      <BlogCardList
        searchParams={createSearchParams({})}
        visitedBlogIds={['1', '2', '3', '4', '5']}
      />,
    );
    expect(screen.getAllByTestId('blog-card')).toHaveLength(3);
  });
});
