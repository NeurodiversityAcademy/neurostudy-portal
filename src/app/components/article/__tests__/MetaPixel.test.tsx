import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID = 'test-pixel-id';

const mockUsePathname = jest.fn(() => '/');
const mockInit = jest.fn();
const mockPageView = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock('react-facebook-pixel', () => ({
  __esModule: true,
  default: {
    init: (...args: unknown[]) => mockInit(...args),
    pageView: (...args: unknown[]) => mockPageView(...args),
  },
}));

import MetaPixel from '../MetaPixel';
import { DEFERRED_ACTIVATION_MS } from '../../../hooks/useDeferredActivation';

describe('MetaPixel', () => {
  const originalPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUsePathname.mockReturnValue('/');
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID = 'test-pixel-id';
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID = originalPixelId;
    jest.useRealTimers();
  });

  it('does not init until the first user interaction', async () => {
    render(<MetaPixel />);
    expect(mockInit).not.toHaveBeenCalled();

    act(() => {
      fireEvent.pointerDown(window);
    });

    await waitFor(() => {
      expect(mockInit).toHaveBeenCalledWith('test-pixel-id');
    });
    expect(mockPageView).toHaveBeenCalled();
  });

  it('inits after the hard timeout when there is no interaction', async () => {
    render(<MetaPixel />);
    expect(mockInit).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(DEFERRED_ACTIVATION_MS);
    });

    await waitFor(() => {
      expect(mockInit).toHaveBeenCalledWith('test-pixel-id');
    });
  });

  it('tracks route changes after the pixel has loaded', async () => {
    mockUsePathname.mockReturnValue('/articles');
    const { container, rerender } = render(<MetaPixel />);
    expect(container).toBeEmptyDOMElement();

    act(() => {
      fireEvent.pointerDown(window);
    });

    await waitFor(() => {
      expect(mockPageView).toHaveBeenCalled();
    });

    const pageViewsAfterFirstRoute = mockPageView.mock.calls.length;

    mockUsePathname.mockReturnValue('/blogs');
    rerender(<MetaPixel />);

    await waitFor(() => {
      expect(mockPageView).toHaveBeenCalledTimes(pageViewsAfterFirstRoute + 1);
    });
  });

  it('does nothing when the Facebook pixel id is missing', async () => {
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID = '';
    render(<MetaPixel />);

    act(() => {
      fireEvent.pointerDown(window);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockInit).not.toHaveBeenCalled();
  });
});
