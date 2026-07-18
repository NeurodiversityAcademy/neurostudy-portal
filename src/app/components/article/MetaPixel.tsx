'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useDeferredActivation } from '../../hooks/useDeferredActivation';

interface FacebookPixelApi {
  init: (pixelId: string) => void;
  pageView: () => void;
}

const MetaPixel = (): null => {
  const pathname = usePathname();
  const isActivated = useDeferredActivation();
  const pixelRef = useRef<FacebookPixelApi | null>(null);
  const facebookPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  useEffect(() => {
    if (!facebookPixelId || !isActivated || pixelRef.current) {
      return;
    }

    let isCancelled = false;

    const loadPixel = async (): Promise<void> => {
      const pixelModule = await import('react-facebook-pixel');
      if (isCancelled) {
        return;
      }

      const ReactPixel = pixelModule.default as FacebookPixelApi;
      ReactPixel.init(facebookPixelId);
      ReactPixel.pageView();
      pixelRef.current = ReactPixel;
    };

    void loadPixel();

    return () => {
      isCancelled = true;
    };
  }, [facebookPixelId, isActivated]);

  useEffect(() => {
    pixelRef.current?.pageView();
  }, [pathname]);

  return null;
};

export default MetaPixel;
