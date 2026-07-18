'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type ReactElement } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ReactPixel: undefined | Record<string, any>;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? '';

const loadPixel = (): Promise<void> =>
  import('react-facebook-pixel')
    .then((module) => module.default)
    .then((pixel) => {
      ReactPixel = pixel;
      ReactPixel.init(FB_PIXEL_ID);
      ReactPixel.pageView();
    });

export default function MetaPixel(): ReactElement | null {
  const pathname = usePathname();

  useEffect(() => {
    if (!FB_PIXEL_ID) {
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
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(() => {
          void loadPixel();
        });
      } else {
        timeoutId = setTimeout(() => {
          void loadPixel();
        }, 2000);
      }
    };

    scheduleLoad();

    return () => {
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [pathname]);

  return null;
}
