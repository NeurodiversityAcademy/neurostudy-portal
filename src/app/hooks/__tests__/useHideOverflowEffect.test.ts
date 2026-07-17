import { renderHook } from '@testing-library/react';
import useHideOverflowEffect from '@/app/hooks/useHideOverflowEffect';

describe('useHideOverflowEffect', () => {
  afterEach(() => {
    document.body.style.removeProperty('overflow');
  });

  it('returns a function that hides overflow on document.body by default', () => {
    const { result } = renderHook(() => useHideOverflowEffect());
    const cleanup = result.current();

    expect(document.body.style.overflow).toBe('hidden');

    cleanup();
  });

  it('restores the original overflow value on cleanup', () => {
    document.body.style.overflow = 'auto';

    const { result } = renderHook(() => useHideOverflowEffect());
    const cleanup = result.current();

    expect(document.body.style.overflow).toBe('hidden');

    cleanup();

    expect(document.body.style.overflow).toBe('auto');
  });

  it('removes overflow property on cleanup when no previous value existed', () => {
    document.body.style.removeProperty('overflow');

    const { result } = renderHook(() => useHideOverflowEffect());
    const cleanup = result.current();

    expect(document.body.style.overflow).toBe('hidden');

    cleanup();

    expect(document.body.style.overflow).toBe('');
  });

  it('applies to a custom element when provided', () => {
    const elem = document.createElement('div');
    elem.style.overflow = 'scroll';

    const { result } = renderHook(() => useHideOverflowEffect(elem));
    const cleanup = result.current();

    expect(elem.style.overflow).toBe('hidden');

    cleanup();

    expect(elem.style.overflow).toBe('scroll');
  });

  it('returns a stable function reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useHideOverflowEffect());

    const first = result.current;
    rerender();
    const second = result.current;

    expect(first).toBe(second);
  });
});
