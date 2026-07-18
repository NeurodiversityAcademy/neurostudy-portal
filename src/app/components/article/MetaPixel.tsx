'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import ReactPixel from 'react-facebook-pixel';
import { useDeferredActivation } from '../../hooks/useDeferredActivation';

const MetaPixel = (): null => {
  const pathname = usePathname();
  const isActivated = useDeferredActivation();
  const isLoadedRef = useRef(false);
  const facebookPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  useEffect(() => {
    if (!facebookPixelId || !isActivated || isLoadedRef.current) {
      return;
    }

    ReactPixel.init(facebookPixelId);
    ReactPixel.pageView();
    isLoadedRef.current = true;
  }, [facebookPixelId, isActivated]);

  useEffect(() => {
    if (!isLoadedRef.current) {
      return;
    }

    ReactPixel.pageView();
  }, [pathname]);

  return null;
};

export default MetaPixel;
