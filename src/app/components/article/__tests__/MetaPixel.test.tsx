import React from 'react';
import { render, waitFor } from '@testing-library/react';

process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID = 'test-pixel-id';

const mockUsePathname = jest.fn(() => '/');

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock('react-facebook-pixel', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    pageView: jest.fn(),
  },
}));

import ReactPixel from 'react-facebook-pixel';
import MetaPixel from '../MetaPixel';

describe('MetaPixel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
  });

  it('renders nothing while tracking route changes via the Facebook pixel', async () => {
    mockUsePathname.mockReturnValue('/articles');
    const { container, rerender } = render(<MetaPixel />);
    expect(container.firstChild).toBeNull();

    await waitFor(() => {
      expect(ReactPixel.pageView).toHaveBeenCalled();
    });

    const pageViewsAfterFirstRoute = (ReactPixel.pageView as jest.Mock).mock
      .calls.length;

    mockUsePathname.mockReturnValue('/blogs');
    rerender(<MetaPixel />);

    await waitFor(() => {
      expect(ReactPixel.pageView).toHaveBeenCalledTimes(
        pageViewsAfterFirstRoute + 1
      );
    });
  });
});
