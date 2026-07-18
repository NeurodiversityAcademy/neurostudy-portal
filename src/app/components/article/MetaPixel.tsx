'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type ReactElement } from 'react';
import useDeferredThirdPartyLoad from '@/app/hooks/useDeferredThirdPartyLoad';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ReactPixel: undefined | Record<string, any>;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? '';

export default function MetaPixel(): ReactElement | null {
  const pathname = usePathname();
  const shouldLoad = useDeferredThirdPartyLoad();

  useEffect(() => {
    if (!shouldLoad || !FB_PIXEL_ID) {
      return;
    }

    const pageView = () => {
      ReactPixel?.pageView();
    };

    if (ReactPixel) {
      pageView();
    } else {
      import('react-facebook-pixel')
        .then((x) => x.default)
        .then((res) => {
          ReactPixel = res;
          ReactPixel.init(FB_PIXEL_ID);
          pageView();
        })
        .catch((error: unknown) => {
          console.error('Failed to load Meta Pixel', error);
        });
    }
  }, [pathname, shouldLoad]);

  return null;
}
