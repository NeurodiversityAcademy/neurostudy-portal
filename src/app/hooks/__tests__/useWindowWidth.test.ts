import { renderHook, act } from '@testing-library/react';
import useWindowWidth from '@/app/hooks/useWindowWidth';

describe('useWindowWidth', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      writable: true,
      configurable: true,
    });
  });

  it('initialises with the current window width', () => {
    const { result } = renderHook(() => useWindowWidth());

    expect(result.current).toBe(1024);
  });

  it('uses the provided default before the effect runs', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 800,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useWindowWidth(999));

    expect(result.current).toBe(800);
  });

  it('updates when the window is resized', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useWindowWidth());

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        value: 768,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(600);
    });

    expect(result.current).toBe(768);
    jest.useRealTimers();
  });

  it('removes the resize listener on unmount', () => {
    jest.useFakeTimers();
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useWindowWidth());

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
    removeSpy.mockRestore();
    jest.useRealTimers();
  });
});
