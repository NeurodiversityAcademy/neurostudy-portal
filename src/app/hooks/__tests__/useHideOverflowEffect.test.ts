import { renderHook } from '@testing-library/react';
import useHideOverflowEffect, { HIDE_OVERFLOW_CLASS } from '@/app/hooks/useHideOverflowEffect';

describe('useHideOverflowEffect', () => {
  afterEach(() => {
    document.body.classList.remove(HIDE_OVERFLOW_CLASS);
  });

  it('returns a function that hides overflow on document.body by default', () => {
    const { result } = renderHook(() => useHideOverflowEffect());
    const cleanup = result.current();

    expect(document.body.classList.contains(HIDE_OVERFLOW_CLASS)).toBe(true);

    cleanup();
  });

  it('removes the hide-overflow class on cleanup', () => {
    const { result } = renderHook(() => useHideOverflowEffect());
    const cleanup = result.current();

    expect(document.body.classList.contains(HIDE_OVERFLOW_CLASS)).toBe(true);

    cleanup();

    expect(document.body.classList.contains(HIDE_OVERFLOW_CLASS)).toBe(false);
  });

  it('applies to a custom element when provided', () => {
    const elem = document.createElement('div');

    const { result } = renderHook(() => useHideOverflowEffect(elem));
    const cleanup = result.current();

    expect(elem.classList.contains(HIDE_OVERFLOW_CLASS)).toBe(true);

    cleanup();

    expect(elem.classList.contains(HIDE_OVERFLOW_CLASS)).toBe(false);
  });

  it('returns a stable function reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useHideOverflowEffect());

    const first = result.current;
    rerender();
    const second = result.current;

    expect(first).toBe(second);
  });
});
