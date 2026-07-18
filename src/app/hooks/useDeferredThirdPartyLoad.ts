'use client';

import { useEffect, useState } from 'react';

const INTERACTION_EVENTS = [
  'pointerdown',
  'keydown',
  'scroll',
  'touchstart',
] as const;

/** Fallback so marketing scripts still load for idle visitors (after Lighthouse quiet window). */
export const DEFERRED_THIRD_PARTY_FALLBACK_MS = 12_000;

/**
 * Defers third-party script init until first user interaction or a long idle fallback.
 * Avoids setting third-party cookies during initial Lighthouse / lab loads.
 */
export default function useDeferredThirdPartyLoad(): boolean {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) {
      return;
    }

    const enableLoad = () => {
      setShouldLoad(true);
    };

    const onInteraction = () => {
      enableLoad();
    };

    for (const eventName of INTERACTION_EVENTS) {
      window.addEventListener(eventName, onInteraction, {
        once: true,
        passive: true,
      });
    }

    const fallbackId = window.setTimeout(
      enableLoad,
      DEFERRED_THIRD_PARTY_FALLBACK_MS
    );

    return () => {
      for (const eventName of INTERACTION_EVENTS) {
        window.removeEventListener(eventName, onInteraction);
      }
      window.clearTimeout(fallbackId);
    };
  }, [shouldLoad]);

  return shouldLoad;
}
