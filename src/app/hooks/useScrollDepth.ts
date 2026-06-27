'use client';

import { useEffect, useRef } from 'react';

const SCROLL_THRESHOLDS = [25, 50, 75, 90, 100] as const;
const SCROLL_PERCENT_SCALE = 100;
const MIN_SCROLLABLE_HEIGHT = 0;
const PASSIVE_SCROLL_LISTENER = { passive: true } as const;

export function useScrollDepth(onThreshold: (percent: number) => void) {
  const fired = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= MIN_SCROLLABLE_HEIGHT) {
        return;
      }

      const percent = Math.round(
        (window.scrollY / docHeight) * SCROLL_PERCENT_SCALE
      );

      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent >= threshold && !fired.current.has(threshold)) {
          fired.current.add(threshold);
          onThreshold(threshold);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, PASSIVE_SCROLL_LISTENER);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onThreshold]);
}
