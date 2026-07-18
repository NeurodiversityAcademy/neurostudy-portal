import { renderHook } from '@testing-library/react';
import { useVisitTracker } from '@/app/hooks/useVisitTracker';

describe('useVisitTracker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('adds article id to localStorage after 5 seconds', () => {
    renderHook(() => useVisitTracker('article-1', 'article'));

    jest.advanceTimersByTime(5000);

    const stored = JSON.parse(localStorage.getItem('visitedArticles')!);
    expect(stored).toEqual(['article-1']);
  });

  it('adds blog id to localStorage after 5 seconds', () => {
    renderHook(() => useVisitTracker('blog-1', 'blog'));

    jest.advanceTimersByTime(5000);

    const stored = JSON.parse(localStorage.getItem('visitedBlogs')!);
    expect(stored).toEqual(['blog-1']);
  });

  it('does not add a duplicate id', () => {
    localStorage.setItem('visitedArticles', JSON.stringify(['article-1']));

    renderHook(() => useVisitTracker('article-1', 'article'));

    jest.advanceTimersByTime(5000);

    const stored = JSON.parse(localStorage.getItem('visitedArticles')!);
    expect(stored).toEqual(['article-1']);
  });

  it('appends to existing visited list', () => {
    localStorage.setItem('visitedBlogs', JSON.stringify(['blog-1']));

    renderHook(() => useVisitTracker('blog-2', 'blog'));

    jest.advanceTimersByTime(5000);

    const stored = JSON.parse(localStorage.getItem('visitedBlogs')!);
    expect(stored).toEqual(['blog-1', 'blog-2']);
  });

  it('does not write before 5 seconds elapse', () => {
    renderHook(() => useVisitTracker('article-1', 'article'));

    jest.advanceTimersByTime(4999);

    expect(localStorage.getItem('visitedArticles')).toBeNull();
  });

  it('clears timeout on unmount', () => {
    const { unmount } = renderHook(() => useVisitTracker('article-1', 'article'));

    unmount();
    jest.advanceTimersByTime(5000);

    expect(localStorage.getItem('visitedArticles')).toBeNull();
  });

  it('resets corrupted localStorage data', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    localStorage.setItem('visitedArticles', '"not-an-array"');

    renderHook(() => useVisitTracker('article-1', 'article'));

    jest.advanceTimersByTime(5000);

    const stored = JSON.parse(localStorage.getItem('visitedArticles')!);
    expect(stored).toEqual(['article-1']);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('resets when stored value is not an array', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    localStorage.setItem('visitedBlogs', JSON.stringify({ key: 'val' }));

    renderHook(() => useVisitTracker('blog-1', 'blog'));

    jest.advanceTimersByTime(5000);

    const stored = JSON.parse(localStorage.getItem('visitedBlogs')!);
    expect(stored).toEqual(['blog-1']);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
