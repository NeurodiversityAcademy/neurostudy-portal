'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect, useState, type ReactElement } from 'react';

/**
 * Defers Vercel Analytics + Speed Insights until after first paint / idle.
 */
export default function DeferredVercelInsights(): ReactElement | null {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const enable = () => setShouldLoad(true);

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(enable, { timeout: 5000 });
    } else {
      timeoutId = setTimeout(enable, 3000);
    }

    return () => {
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
