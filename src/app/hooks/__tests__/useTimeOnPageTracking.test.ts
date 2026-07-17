import { renderHook } from '@testing-library/react';
import { useTimeOnPageTracking } from '@/app/hooks/useTimeOnPageTracking';

describe('useTimeOnPageTracking', () => {
  const mockReporter = jest.fn();

  beforeEach(() => {
    mockReporter.mockClear();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reports time on page when visibility becomes hidden', () => {
    renderHook(() => useTimeOnPageTracking(mockReporter));

    jest.advanceTimersByTime(3000);

    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(mockReporter).toHaveBeenCalledWith(3);
  });

  it('reports time on page on beforeunload', () => {
    renderHook(() => useTimeOnPageTracking(mockReporter));

    jest.advanceTimersByTime(5000);

    window.dispatchEvent(new Event('beforeunload'));

    expect(mockReporter).toHaveBeenCalledWith(5);
  });

  it('reports only once even if multiple events fire', () => {
    renderHook(() => useTimeOnPageTracking(mockReporter));

    jest.advanceTimersByTime(2000);

    window.dispatchEvent(new Event('beforeunload'));

    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(mockReporter).toHaveBeenCalledTimes(1);
  });

  it('does not fire for visible visibilitychange', () => {
    renderHook(() => useTimeOnPageTracking(mockReporter));

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
      configurable: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(mockReporter).not.toHaveBeenCalled();
  });

  it('reports on unmount via cleanup', () => {
    const { unmount } = renderHook(() => useTimeOnPageTracking(mockReporter));

    jest.advanceTimersByTime(7000);

    unmount();

    expect(mockReporter).toHaveBeenCalledWith(7);
  });

  it('cleans up event listeners on unmount', () => {
    const removeWindowSpy = jest.spyOn(window, 'removeEventListener');
    const removeDocSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useTimeOnPageTracking(mockReporter));

    unmount();

    expect(removeWindowSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    expect(removeDocSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

    removeWindowSpy.mockRestore();
    removeDocSpy.mockRestore();
  });
});
