import React from 'react';
import { render } from '@testing-library/react';

jest.mock('@/app/hooks/useVisitTracker', () => ({
  useVisitTracker: jest.fn(),
}));

import { useVisitTracker } from '@/app/hooks/useVisitTracker';
import VisitTrackerWrapper from '../VisitTrackerWrapper';

const mockUseVisitTracker = useVisitTracker as jest.Mock;

describe('VisitTrackerWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing', () => {
    const { container } = render(
      <VisitTrackerWrapper id='article-1' type='article' />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls useVisitTracker with article id and type', () => {
    render(<VisitTrackerWrapper id='article-1' type='article' />);
    expect(mockUseVisitTracker).toHaveBeenCalledWith('article-1', 'article');
  });

  it('calls useVisitTracker with blog id and type', () => {
    render(<VisitTrackerWrapper id='blog-5' type='blog' />);
    expect(mockUseVisitTracker).toHaveBeenCalledWith('blog-5', 'blog');
  });
});
