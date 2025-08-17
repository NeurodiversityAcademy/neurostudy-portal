'use client';
import { useEffect } from 'react';

export function useVisitTracker(id: string, type: 'article' | 'blog'): void {
  useEffect(() => {
    const storageKey = type === 'article' ? 'visitedArticles' : 'visitedBlogs';
    const timer = setTimeout(() => {
      try {
        const item = localStorage.getItem(storageKey) || '[]';
        const visited = JSON.parse(item);
        if (!Array.isArray(visited)) {
          // If data is not an array, reset it.
          throw new Error('Stored data is not an array.');
        }
        if (!visited.includes(id)) {
          visited.push(id);
          localStorage.setItem(storageKey, JSON.stringify(visited));
        }
      } catch (error) {
        console.error(
          `Failed to parse or update visited items for key "${storageKey}". Resetting with current item.`,
          error
        );
        // If storage is corrupted or not an array, overwrite it.
        localStorage.setItem(storageKey, JSON.stringify([id]));
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, type]);
}
