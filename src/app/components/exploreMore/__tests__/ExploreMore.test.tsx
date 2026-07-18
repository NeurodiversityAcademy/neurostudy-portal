import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/test',
}));

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

import ExploreMore from '../ExploreMore';

describe('ExploreMore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Explore more button', () => {
    render(<ExploreMore dest='/articles' />);
    expect(screen.getByText('Explore more')).toBeInTheDocument();
  });

  it('navigates to dest when clicked', () => {
    render(<ExploreMore dest='/articles' />);
    fireEvent.click(screen.getByText('Explore more'));
    expect(mockPush).toHaveBeenCalledWith('/articles');
  });

  it('navigates to different destinations', () => {
    render(<ExploreMore dest='/blogs' />);
    fireEvent.click(screen.getByText('Explore more'));
    expect(mockPush).toHaveBeenCalledWith('/blogs');
  });
});
