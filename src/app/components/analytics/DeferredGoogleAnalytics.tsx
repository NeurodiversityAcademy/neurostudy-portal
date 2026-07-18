'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import { useEffect, useState, type ReactElement } from 'react';

interface DeferredGoogleAnalyticsProps {
  gaId: string;
  debugMode?: boolean;
}

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const;

/**
 * Loads GA after first user interaction (or a long idle fallback) so it does
 * not compete with LCP/FCP on initial paint.
 */
export default function DeferredGoogleAnalytics({
  gaId,
  debugMode = false,
}: DeferredGoogleAnalyticsProps): ReactElement | null {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) {
      return;
    }

    const enable = () => setShouldLoad(true);

    for (const eventName of INTERACTION_EVENTS) {
      window.addEventListener(eventName, enable, { once: true, passive: true });
    }

    const timeoutId = setTimeout(enable, 8000);

    return () => {
      for (const eventName of INTERACTION_EVENTS) {
        window.removeEventListener(eventName, enable);
      }
      clearTimeout(timeoutId);
    };
  }, [shouldLoad]);

  if (!shouldLoad) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} debugMode={debugMode} />;
}
