'use client';
import { useState, useEffect } from 'react';

export function useVisitedItems(type: 'article' | 'blog'): string[] {
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const storageKey = type === 'article' ? 'visitedArticles' : 'visitedBlogs';

  useEffect(() => {
    const getVisited = () => {
      try {
        const item = localStorage.getItem(storageKey);
        const visited = item ? JSON.parse(item) : [];
        setVisitedIds(visited);
      } catch (e) {
        console.error('Failed to parse visited items from localStorage', e);
        setVisitedIds([]);
      }
    };

    // Only get visited items once on mount
    getVisited();
  }, [storageKey]);

  return visitedIds;
}
