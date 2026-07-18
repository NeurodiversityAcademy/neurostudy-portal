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
  const originalPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID = 'test-pixel-id';

    window.requestIdleCallback = ((callback: IdleRequestCallback) => {
      callback({
        didTimeout: false,
        timeRemaining: () => 50,
      });
      return 1;
    }) as typeof window.requestIdleCallback;
    window.cancelIdleCallback = jest.fn() as typeof window.cancelIdleCallback;
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID = originalPixelId;
    delete (window as { requestIdleCallback?: unknown }).requestIdleCallback;
    delete (window as { cancelIdleCallback?: unknown }).cancelIdleCallback;
  });

  it('renders nothing while tracking route changes via the Facebook pixel', async () => {
    mockUsePathname.mockReturnValue('/articles');
    const { container, rerender } = render(<MetaPixel />);
    expect(container).toBeEmptyDOMElement();

    await waitFor(() => {
      expect(ReactPixel.pageView).toHaveBeenCalled();
    });

    const pageViewsAfterFirstRoute = (ReactPixel.pageView as jest.Mock).mock.calls.length;

    mockUsePathname.mockReturnValue('/blogs');
    rerender(<MetaPixel />);

    await waitFor(() => {
      expect(ReactPixel.pageView).toHaveBeenCalledTimes(pageViewsAfterFirstRoute + 1);
    });
  });

  it('does nothing when the Facebook pixel id is missing', () => {
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID = '';
    render(<MetaPixel />);
    expect(ReactPixel.init).not.toHaveBeenCalled();
  });
});
