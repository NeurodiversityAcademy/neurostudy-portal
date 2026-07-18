import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import DeferredVercelInsights from '../DeferredVercelInsights';

jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid='vercel-analytics' />,
}));

jest.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <div data-testid='vercel-speed-insights' />,
}));

describe('DeferredVercelInsights', () => {
  afterEach(() => {
    delete (window as { requestIdleCallback?: unknown }).requestIdleCallback;
    delete (window as { cancelIdleCallback?: unknown }).cancelIdleCallback;
    jest.useRealTimers();
  });

  it('loads insights after requestIdleCallback', async () => {
    window.requestIdleCallback = ((callback: IdleRequestCallback) => {
      callback({
        didTimeout: false,
        timeRemaining: () => 50,
      });
      return 1;
    }) as typeof window.requestIdleCallback;
    window.cancelIdleCallback = jest.fn() as typeof window.cancelIdleCallback;

    render(<DeferredVercelInsights />);

    await waitFor(() => {
      expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
    });
    expect(screen.getByTestId('vercel-speed-insights')).toBeInTheDocument();
  });

  it('falls back to a timeout when requestIdleCallback is unavailable', async () => {
    jest.useFakeTimers();
    delete (window as { requestIdleCallback?: unknown }).requestIdleCallback;

    render(<DeferredVercelInsights />);
    expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
    });
    expect(screen.getByTestId('vercel-speed-insights')).toBeInTheDocument();
  });

  it('cancels a pending idle callback on unmount', () => {
    const cancelIdleCallback = jest.fn();
    window.requestIdleCallback = (() => 42) as typeof window.requestIdleCallback;
    window.cancelIdleCallback = cancelIdleCallback as typeof window.cancelIdleCallback;

    const { unmount } = render(<DeferredVercelInsights />);
    unmount();

    expect(cancelIdleCallback).toHaveBeenCalledWith(42);
  });
});
