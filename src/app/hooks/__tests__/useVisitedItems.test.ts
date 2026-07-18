import { renderHook } from '@testing-library/react';
import { useVisitedItems } from '@/app/hooks/useVisitedItems';

describe('useVisitedItems', () => {
  const mockSearchParams =
    new URLSearchParams() as unknown as import('next/navigation').ReadonlyURLSearchParams;

  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty array when nothing is stored', () => {
    const { result } = renderHook(() => useVisitedItems('article', mockSearchParams));

    expect(result.current).toEqual([]);
  });

  it('returns visited article ids from localStorage', () => {
    localStorage.setItem('visitedArticles', JSON.stringify(['a-1', 'a-2']));

    const { result } = renderHook(() => useVisitedItems('article', mockSearchParams));

    expect(result.current).toEqual(['a-1', 'a-2']);
  });

  it('returns visited blog ids from localStorage', () => {
    localStorage.setItem('visitedBlogs', JSON.stringify(['b-1']));

    const { result } = renderHook(() => useVisitedItems('blog', mockSearchParams));

    expect(result.current).toEqual(['b-1']);
  });

  it('returns empty array when localStorage has invalid JSON', () => {
    localStorage.setItem('visitedArticles', '{{invalid');

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useVisitedItems('article', mockSearchParams));

    expect(result.current).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
