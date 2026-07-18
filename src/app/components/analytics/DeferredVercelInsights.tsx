'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useDeferredActivation } from '../../hooks/useDeferredActivation';

/**
 * Defers Vercel Analytics / Speed Insights until interaction or hard timeout so
 * they do not compete with first paint.
 */
const DeferredVercelInsights = (): React.JSX.Element | null => {
  const shouldLoad = useDeferredActivation();

  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default DeferredVercelInsights;
