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
    setFetch(jest.fn().mockResolvedValue({ ok: false }));

    render(<SearchVerification />);

    expect(
      await screen.findByText(/Search is available to people using this site/),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('stops retrying after repeated attempts', async () => {
    window.sessionStorage.setItem(ATTEMPT_KEY, '2');
    const fetchMock = jest.fn();
    setFetch(fetchMock);

    render(<SearchVerification />);

    expect(
      await screen.findByText(/Search is available to people using this site/),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
