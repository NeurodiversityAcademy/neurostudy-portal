import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('@/app/hooks/useVisitedItems', () => ({
  useVisitedItems: jest.fn(),
}));

jest.mock('../../blog/BlogCardList', () => ({
  __esModule: true,
  default: ({
    visitedBlogIds,
  }: {
    visitedBlogIds: (number | string)[];
  }) => (
    <div data-testid='blog-card-list'>
      Visited: {visitedBlogIds.join(',')}
    </div>
  ),
}));

import { useSearchParams } from 'next/navigation';
import { useVisitedItems } from '@/app/hooks/useVisitedItems';
import BlogCardListWrapper from '../BlogCardListWrapper';

const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUseVisitedItems = useVisitedItems as jest.Mock;

describe('BlogCardListWrapper', () => {
  beforeEach(() => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ title: 'test-blog' }));
    mockUseVisitedItems.mockReturnValue(['1', '2']);
  });

  it('passes search params and visited blog ids to BlogCardList', () => {
    render(<BlogCardListWrapper />);
    expect(screen.getByTestId('blog-card-list')).toHaveTextContent('Visited: 1,2');
    expect(mockUseSearchParams).toHaveBeenCalled();
    expect(mockUseVisitedItems).toHaveBeenCalledWith(
      'blog',
      expect.any(URLSearchParams),
    );
  });
});
