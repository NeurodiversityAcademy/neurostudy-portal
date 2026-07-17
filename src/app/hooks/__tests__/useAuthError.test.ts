import { renderHook } from '@testing-library/react';
import useAuthError from '@/app/hooks/useAuthError';
import * as common from '@/app/utilities/common';

const mockReplace = jest.fn();
const mockGet = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => ({ get: mockGet }),
}));

jest.mock('@/app/utilities/queryString', () => ({
  __esModule: true,
  default: {
    stringify: jest.fn(() => '?cleaned=true'),
  },
}));

describe('useAuthError', () => {
  let notifyErrorSpy: jest.SpyInstance;
  const originalHash = window.location.hash;

  beforeEach(() => {
    jest.useFakeTimers();
    mockReplace.mockClear();
    mockGet.mockClear();
    notifyErrorSpy = jest.spyOn(common, 'notifyError').mockImplementation();

    window.location.hash = '#test';
  });

  afterEach(() => {
    jest.useRealTimers();
    notifyErrorSpy.mockRestore();
    window.location.hash = originalHash;
  });

  it('does nothing when there is no error param', () => {
    mockGet.mockReturnValue(null);

    renderHook(() => useAuthError());

    jest.runAllTimers();

    expect(notifyErrorSpy).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('shows OAuthCallback error message and replaces URL', () => {
    mockGet.mockReturnValue('OAuthCallback');

    renderHook(() => useAuthError());

    jest.runAllTimers();

    expect(notifyErrorSpy).toHaveBeenCalledWith(
      'Error during authentication. Please try again later.',
    );
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('?cleaned=true'));
  });

  it('shows Callback error message', () => {
    mockGet.mockReturnValue('Callback');

    renderHook(() => useAuthError());

    jest.runAllTimers();

    expect(notifyErrorSpy).toHaveBeenCalledWith(
      'User was not granted access. Please try again later.',
    );
  });

  it('shows AuthRequired error message', () => {
    mockGet.mockReturnValue('AuthRequired');

    renderHook(() => useAuthError());

    jest.runAllTimers();

    expect(notifyErrorSpy).toHaveBeenCalledWith('Please login first.');
  });

  it('shows unknown error message for unrecognised errors', () => {
    mockGet.mockReturnValue('SomethingElse');

    renderHook(() => useAuthError());

    jest.runAllTimers();

    expect(notifyErrorSpy).toHaveBeenCalledWith(
      'Unknown error occurred, please try back again later.',
    );
  });
});
