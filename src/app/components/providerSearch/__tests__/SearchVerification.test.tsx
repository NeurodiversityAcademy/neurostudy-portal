/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import SearchVerification from '../SearchVerification';

const refreshMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const ATTEMPT_KEY = 'nda-botid-verify-attempts';

function setFetch(mock: jest.Mock): void {
  (global as typeof globalThis & { fetch: jest.Mock }).fetch = mock;
}

describe('SearchVerification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.sessionStorage.clear();
  });

  it('verifies and refreshes the page on success', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    setFetch(fetchMock);

    render(<SearchVerification />);

    expect(screen.getByRole('status')).toHaveTextContent('Checking your browser');
    await waitFor(() => expect(refreshMock).toHaveBeenCalled());
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/verify',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('explains when verification fails and offers a retry', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    setFetch(
      jest.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        text: async () => '{"error":"Search is available to people using this site."}',
      }),
    );

    render(<SearchVerification />);

    expect(
      await screen.findByText(/Search is available to people using this site/),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(refreshMock).not.toHaveBeenCalled();

    // The rejection is the only browser-visible cause, so it must carry detail.
    expect(errorSpy).toHaveBeenCalledWith(
      '[search-verify] verification rejected by /api/verify',
      expect.objectContaining({
        status: 403,
        statusText: 'Forbidden',
        attempt: 1,
        body: expect.stringContaining('Search is available to people using this site'),
      }),
    );

    errorSpy.mockRestore();
  });

  it('stops retrying after repeated attempts', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    window.sessionStorage.setItem(ATTEMPT_KEY, '2');
    const fetchMock = jest.fn();
    setFetch(fetchMock);

    render(<SearchVerification />);

    expect(
      await screen.findByText(/Search is available to people using this site/),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(
      '[search-verify] giving up: retry budget exhausted',
      expect.objectContaining({ attempts: 2, maxAttempts: 2 }),
    );

    errorSpy.mockRestore();
  });
});
