import { act, fireEvent, renderHook } from '@testing-library/react';
import { DEFERRED_ACTIVATION_MS, useDeferredActivation } from '../useDeferredActivation';

describe('useDeferredActivation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts inactive', () => {
    const { result } = renderHook(() => useDeferredActivation());
    expect(result.current).toBe(false);
  });

  it('activates on the first user interaction', () => {
    const { result } = renderHook(() => useDeferredActivation());

    act(() => {
      fireEvent.pointerDown(window);
    });

    expect(result.current).toBe(true);
  });

  it('activates after the hard timeout', () => {
    const { result } = renderHook(() => useDeferredActivation());

    act(() => {
      jest.advanceTimersByTime(DEFERRED_ACTIVATION_MS);
    });

    expect(result.current).toBe(true);
  });

  it('respects a custom hard timeout', () => {
    const { result } = renderHook(() => useDeferredActivation(2000));

    act(() => {
      jest.advanceTimersByTime(1999);
    });
    expect(result.current).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });
});
