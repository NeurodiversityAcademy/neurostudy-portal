import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import DeferredVercelInsights from '../DeferredVercelInsights';
import { DEFERRED_ACTIVATION_MS } from '../../../hooks/useDeferredActivation';

jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid='vercel-analytics' />,
}));

jest.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <div data-testid='vercel-speed-insights' />,
}));

describe('DeferredVercelInsights', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not load insights on initial render', () => {
    render(<DeferredVercelInsights />);
    expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument();
  });

  it('loads insights after the first user interaction', async () => {
    render(<DeferredVercelInsights />);

    act(() => {
      fireEvent.pointerDown(window);
    });

    await waitFor(() => {
      expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
    });
    expect(screen.getByTestId('vercel-speed-insights')).toBeInTheDocument();
  });

  it('loads insights after the hard timeout when there is no interaction', async () => {
    render(<DeferredVercelInsights />);
    expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(DEFERRED_ACTIVATION_MS);
    });

    await waitFor(() => {
      expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
    });
    expect(screen.getByTestId('vercel-speed-insights')).toBeInTheDocument();
  });
});
