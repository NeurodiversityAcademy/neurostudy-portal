'use client';

import Script from 'next/script';
import { useEffect, useState, type ReactElement } from 'react';
import { TABNAV_WIDGET_CONFIG_JSON, TABNAV_WIDGET_SCRIPT_SRC } from './tabNavConstants';

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart'] as const;

/**
 * Defer TabNav until idle/interaction so the third-party widget does not block LCP/TBT.
 */
export default function DeferredTabNavEmbed(): ReactElement | null {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) {
      return;
    }

    const enable = () => setShouldLoad(true);

    for (const eventName of INTERACTION_EVENTS) {
      window.addEventListener(eventName, enable, { once: true, passive: true });
    }

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(enable, { timeout: 6000 });
    } else {
      timeoutId = setTimeout(enable, 6000);
    }

    return () => {
      for (const eventName of INTERACTION_EVENTS) {
        window.removeEventListener(eventName, enable);
      }
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [shouldLoad]);

  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      <Script
        id='tabnav-accessibility-widget'
        src={TABNAV_WIDGET_SCRIPT_SRC}
        strategy='lazyOnload'
        tnv-data-config={TABNAV_WIDGET_CONFIG_JSON}
      />
      <noscript>
        JavaScript is required for{' '}
        <a href='https://tabnav.com/accessibility-widget'>accessibility widget</a> to work properly.
      </noscript>
    </>
  );
}
