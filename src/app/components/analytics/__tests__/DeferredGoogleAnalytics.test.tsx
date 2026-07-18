import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import DeferredGoogleAnalytics from '../DeferredGoogleAnalytics';

jest.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: ({ gaId, debugMode }: { gaId: string; debugMode?: boolean }) => (
    <div data-testid='google-analytics' data-ga-id={gaId} data-debug={String(!!debugMode)} />
  ),
}));

describe('DeferredGoogleAnalytics', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing until the first user interaction', async () => {
    render(<DeferredGoogleAnalytics gaId='G-TEST' debugMode />);

    expect(screen.queryByTestId('google-analytics')).not.toBeInTheDocument();

    act(() => {
      fireEvent.pointerDown(window);
    });

    await waitFor(() => {
      expect(screen.getByTestId('google-analytics')).toBeInTheDocument();
    });
    expect(screen.getByTestId('google-analytics')).toHaveAttribute('data-ga-id', 'G-TEST');
    expect(screen.getByTestId('google-analytics')).toHaveAttribute('data-debug', 'true');
  });

  it('loads GA after the fallback timeout when there is no interaction', async () => {
    render(<DeferredGoogleAnalytics gaId='G-FALLBACK' />);

    expect(screen.queryByTestId('google-analytics')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(8000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('google-analytics')).toBeInTheDocument();
    });
    expect(screen.getByTestId('google-analytics')).toHaveAttribute('data-ga-id', 'G-FALLBACK');
  });
});
