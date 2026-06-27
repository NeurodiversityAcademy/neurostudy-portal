import { renderHook } from '@testing-library/react';
import { useScrollDepth } from '../useScrollDepth';

describe('useScrollDepth', () => {
  const mockOnThreshold = jest.fn();

  beforeEach(() => {
    mockOnThreshold.mockClear();
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 3000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 1000,
      writable: true,
      configurable: true,
    });
  });

  it('fires callback when scroll passes a threshold', () => {
    renderHook(() => useScrollDepth(mockOnThreshold));
    window.scrollY = 500;
    window.dispatchEvent(new Event('scroll'));
    expect(mockOnThreshold).toHaveBeenCalledWith(25);
  });

  it('fires for multiple thresholds as scroll increases', () => {
    renderHook(() => useScrollDepth(mockOnThreshold));
    window.scrollY = 500;
    window.dispatchEvent(new Event('scroll'));
    window.scrollY = 1000;
    window.dispatchEvent(new Event('scroll'));
    window.scrollY = 1500;
    window.dispatchEvent(new Event('scroll'));
    expect(mockOnThreshold).toHaveBeenCalledWith(25);
    expect(mockOnThreshold).toHaveBeenCalledWith(50);
    expect(mockOnThreshold).toHaveBeenCalledWith(75);
  });

  it('does not re-fire already-reached thresholds', () => {
    renderHook(() => useScrollDepth(mockOnThreshold));
    window.scrollY = 500;
    window.dispatchEvent(new Event('scroll'));
    window.scrollY = 700;
    window.dispatchEvent(new Event('scroll'));
    expect(mockOnThreshold).toHaveBeenCalledTimes(1);
  });

  it('does not fire when page is not scrollable', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1000,
      writable: true,
      configurable: true,
    });
    renderHook(() => useScrollDepth(mockOnThreshold));
    window.scrollY = 500;
    window.dispatchEvent(new Event('scroll'));
    expect(mockOnThreshold).not.toHaveBeenCalled();
  });

  it('removes scroll listener on unmount', () => {
    const { unmount } = renderHook(() => useScrollDepth(mockOnThreshold));
    unmount();
    window.scrollY = 500;
    window.dispatchEvent(new Event('scroll'));
    expect(mockOnThreshold).not.toHaveBeenCalled();
  });
});
