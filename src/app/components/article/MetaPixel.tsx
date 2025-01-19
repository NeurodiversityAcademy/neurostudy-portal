'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? '';
export default function MetaPixel(): JSX.Element {
  const pathname = usePathname();
  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(FB_PIXEL_ID);
        ReactPixel.pageView();
      });
  }, [pathname]);

  return <></>;
}
