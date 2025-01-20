'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ReactPixel: undefined | Record<string, any>;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? '';

export default function MetaPixel(): JSX.Element | null {
  const pathname = usePathname();

  useEffect(() => {
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
        });
    }
  }, [pathname]);

  return null;
}
