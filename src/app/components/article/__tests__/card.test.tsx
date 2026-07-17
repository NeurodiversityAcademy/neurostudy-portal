import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('@/app/hooks/useVisitedItems', () => ({
  useVisitedItems: jest.fn(),
}));

jest.mock('../Article', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid='article-card'>{title}</div>,
}));

import { useSearchParams } from 'next/navigation';
import { useVisitedItems } from '@/app/hooks/useVisitedItems';
import CardList from '../card';

const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUseVisitedItems = useVisitedItems as jest.Mock;

describe('CardList', () => {
  beforeEach(() => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    mockUseVisitedItems.mockReturnValue([]);
  });

  it('renders up to three article cards', () => {
    render(<CardList />);
    const cards = screen.getAllByTestId('article-card');
    expect(cards).toHaveLength(3);
  });

  it('excludes the current article from the title query param', () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams({
        title: '6-steps-to-enhancing-accessibility-for-neurodivergent-students-in-higher-education',
      }),
    );
    render(<CardList />);
    const titles = screen.getAllByTestId('article-card').map((el) => el.textContent);
    expect(titles).not.toContain(
      '6 Steps to Enhancing Accessibility for Neurodivergent Students In Higher Education',
    );
  });

  it('excludes visited articles', () => {
    mockUseVisitedItems.mockReturnValue(['2', '3', '4']);
    render(<CardList />);
    const titles = screen.getAllByTestId('article-card').map((el) => el.textContent);
    expect(titles).not.toContain(
      'Creating a Neuro-Inclusive Higher Education Organisation: A Five-Step Guide ',
    );
  });

  it('fills remaining slots when fewer than three unvisited articles remain', () => {
    mockUseVisitedItems.mockReturnValue(['1', '2', '3', '4', '5']);
    render(<CardList />);
    expect(screen.getAllByTestId('article-card')).toHaveLength(3);
  });
});
