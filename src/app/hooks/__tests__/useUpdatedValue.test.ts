import { renderHook } from '@testing-library/react';
import useUpdatedValue from '@/app/hooks/useUpdatedValue';

describe('useUpdatedValue', () => {
  it('computes the initial value from the setter', () => {
    const { result } = renderHook(() => useUpdatedValue(5, (n) => n * 2));

    expect(result.current).toBe(10);
  });

  it('recomputes when the dependent state changes', () => {
    let dep = 3;
    const { result, rerender } = renderHook(() => useUpdatedValue(dep, (n) => n + 1));

    expect(result.current).toBe(4);

    dep = 10;
    rerender();

    expect(result.current).toBe(11);
  });

  it('does not recompute when the dependent state is the same', () => {
    const setter = jest.fn((n: number) => n * 3);
    const { result, rerender } = renderHook(() => useUpdatedValue(4, setter));

    expect(result.current).toBe(12);
    expect(setter).toHaveBeenCalledTimes(1);

    rerender();

    expect(setter).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(12);
  });

  it('handles object state changes via deep comparison', () => {
    let dep = { a: 1 };
    const { result, rerender } = renderHook(() => useUpdatedValue(dep, (d) => d.a));

    expect(result.current).toBe(1);

    dep = { a: 1 };
    rerender();
    expect(result.current).toBe(1);

    dep = { a: 2 };
    rerender();
    expect(result.current).toBe(2);
  });

  it('handles array state changes via deep comparison', () => {
    let dep = [1, 2, 3];
    const { result, rerender } = renderHook(() => useUpdatedValue(dep, (d) => d.length));

    expect(result.current).toBe(3);

    dep = [1, 2, 3];
    rerender();
    expect(result.current).toBe(3);

    dep = [1, 2, 3, 4];
    rerender();
    expect(result.current).toBe(4);
  });
});
