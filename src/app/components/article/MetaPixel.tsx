'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type ReactElement } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ReactPixel: undefined | Record<string, any>;

const loadPixel = (pixelId: string): Promise<void> =>
  import('react-facebook-pixel')
    .then((module) => module.default)
    .then((pixel) => {
      ReactPixel = pixel;
      ReactPixel.init(pixelId);
      ReactPixel.pageView();
    });

export default function MetaPixel(): ReactElement | null {
  const pathname = usePathname();

  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? '';
    if (!pixelId) {
      return;
    }

    const trackPageView = () => {
      ReactPixel?.pageView();
    };

    if (ReactPixel) {
      trackPageView();
      return;
    }

    // Defer Meta Pixel until the browser is idle so it does not compete with LCP.
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const scheduleLoad = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(() => {
          void loadPixel(pixelId);
        });
      } else {
        timeoutId = setTimeout(() => {
          void loadPixel(pixelId);
        }, 2000);
      }
    };

    scheduleLoad();

    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [pathname]);

  return null;
}
