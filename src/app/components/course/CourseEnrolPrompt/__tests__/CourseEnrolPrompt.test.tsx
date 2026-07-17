import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockNotifyError = jest.fn();
const mockNotifyAxiosError = jest.fn();
const mockCreateCheckoutUrl = jest.fn();
const mockParse = jest.fn(() => ({}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
}));

jest.mock('@/app/utilities/queryString', () => ({
  __esModule: true,
  default: { parse: (...args: unknown[]) => mockParse(...args) },
}));

jest.mock('@/app/utilities/common', () => ({
  notifyError: (...args: unknown[]) => mockNotifyError(...args),
  notifyAxiosError: (...args: unknown[]) => mockNotifyAxiosError(...args),
}));

jest.mock('@/app/utilities/course/createCheckoutUrl', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockCreateCheckoutUrl(...args),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { priority, fill, quality, ...rest } = props;
    return <img {...rest} />;
  },
}));

import { useSession } from 'next-auth/react';
import CourseEnrolPrompt from '../index';
import {
  COURSE_ENROL_CACHE_STORAGE,
  COURSE_ENROL_POPUP_CLOSED_KEY,
} from '@/app/utilities/course/constants';

const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    },
    resetMocks: () => {
      store = {};
      sessionStorageMock.getItem.mockImplementation((key: string) => store[key] ?? null);
      sessionStorageMock.setItem.mockImplementation((key: string, value: string) => {
        store[key] = value;
      });
    },
  };
})();

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorageMock.resetMocks();
  Object.defineProperty(window, COURSE_ENROL_CACHE_STORAGE, {
    value: sessionStorageMock,
    writable: true,
    configurable: true,
  });
  (useSession as jest.Mock).mockReturnValue({
    data: null,
    status: 'unauthenticated',
  });
  mockParse.mockReturnValue({});
});

describe('CourseEnrolPrompt', () => {
  it('shows enrol popup when session is unauthenticated and popup was not closed', async () => {
    render(<CourseEnrolPrompt />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enrol now/i })).toBeInTheDocument();
    });
  });

  it('shows banner but not popup when popup was previously closed', async () => {
    sessionStorageMock.getItem.mockReturnValue('1');

    render(<CourseEnrolPrompt />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^enrol$/i })).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /enrol now/i })).not.toBeInTheDocument();
  });

  it('does not open popup when user is authenticated', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test' } },
      status: 'authenticated',
    });

    render(<CourseEnrolPrompt />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^enrol$/i })).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /enrol now/i })).not.toBeInTheDocument();
  });

  it('closes popup and persists flag when checkout is requested successfully', async () => {
    mockCreateCheckoutUrl.mockResolvedValue({ url: 'https://checkout.test' });
    const user = userEvent.setup();

    render(<CourseEnrolPrompt />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enrol now/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /enrol now/i }));

    await waitFor(() => {
      expect(mockCreateCheckoutUrl).toHaveBeenCalled();
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(COURSE_ENROL_POPUP_CLOSED_KEY, '1');
      expect(screen.queryByRole('button', { name: /enrol now/i })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^enrol$/i })).toBeInTheDocument();
    });
  });

  it('notifies on checkout API error', async () => {
    mockCreateCheckoutUrl.mockRejectedValue(new Error('Checkout failed'));
    const user = userEvent.setup();

    render(<CourseEnrolPrompt />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enrol now/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /enrol now/i }));

    await waitFor(() => {
      expect(mockNotifyAxiosError).toHaveBeenCalled();
    });
  });

  it('notifies error when checkout_status is failure', async () => {
    jest.useFakeTimers();
    mockParse.mockReturnValue({
      checkout_status: 'failure',
      error: 'Payment declined',
    });

    render(<CourseEnrolPrompt />);

    act(() => {
      jest.runAllTimers();
    });

    expect(mockNotifyError).toHaveBeenCalledWith(expect.stringContaining('Payment declined'), {
      duration: -1,
    });

    jest.useRealTimers();
  });

  it('notifies default stripe error when checkout is canceled without message', async () => {
    jest.useFakeTimers();
    mockParse.mockReturnValue({ checkout_status: 'canceled' });

    render(<CourseEnrolPrompt />);

    act(() => {
      jest.runAllTimers();
    });

    expect(mockNotifyError).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
