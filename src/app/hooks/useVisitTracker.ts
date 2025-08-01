'use client';
import { useEffect } from 'react';

export function useVisitTracker(id: string, type: 'article' | 'blog'): void {
  useEffect(() => {
    const storageKey = type === 'article' ? 'visitedArticles' : 'visitedBlogs';
    const timer = setTimeout(() => {
      const visited = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!visited.includes(id)) {
        visited.push(id);
        localStorage.setItem(storageKey, JSON.stringify(visited));
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, type]);
}
