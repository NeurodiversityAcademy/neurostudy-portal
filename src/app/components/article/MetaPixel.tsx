'use client';

import React, { useEffect } from 'react';

export default function MetaPixel(): JSX.Element {
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? '';
  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(FB_PIXEL_ID);
        ReactPixel.pageView();
      });
  });

  return <></>;
}
