import { renderHook } from '@testing-library/react';
import useIsProfileSectionEmpty from '@/app/hooks/useIsProfileSectionEmpty';
import type { UserProps } from '@/app/interfaces/User';

describe('useIsProfileSectionEmpty', () => {
  it('returns truthy when data is undefined', () => {
    const { result } = renderHook(() =>
      useIsProfileSectionEmpty(undefined)
    );

    expect(result.current).toBeTruthy();
  });

  it('returns true for an empty object', () => {
    const { result } = renderHook(() =>
      useIsProfileSectionEmpty({} as UserProps)
    );

    expect(result.current).toBe(true);
  });

  it('returns true when all string values are empty', () => {
    const data: UserProps = { FirstName: '', LastName: '' };

    const { result } = renderHook(() =>
      useIsProfileSectionEmpty(data)
    );

    expect(result.current).toBe(true);
  });

  it('returns true when array values contain only empty strings', () => {
    const data: UserProps = { Conditions: ['', ''] };

    const { result } = renderHook(() =>
      useIsProfileSectionEmpty(data)
    );

    expect(result.current).toBe(true);
  });

  it('returns false when a string value is non-empty', () => {
    const data: UserProps = { FirstName: 'Alice' };

    const { result } = renderHook(() =>
      useIsProfileSectionEmpty(data)
    );

    expect(result.current).toBe(false);
  });

  it('returns false when an array has non-empty strings', () => {
    const data: UserProps = { Conditions: ['ADHD'] };

    const { result } = renderHook(() =>
      useIsProfileSectionEmpty(data)
    );

    expect(result.current).toBe(false);
  });

  it('returns false when a boolean value is present', () => {
    const data: UserProps = { FocusAids: false };

    const { result } = renderHook(() =>
      useIsProfileSectionEmpty(data)
    );

    expect(result.current).toBe(false);
  });

  it('caches the result when data does not change', () => {
    const data: UserProps = { FirstName: 'Bob' };

    const { result, rerender } = renderHook(() =>
      useIsProfileSectionEmpty(data)
    );

    const first = result.current;
    rerender();

    expect(result.current).toBe(first);
  });
});
