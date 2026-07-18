'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import { useDeferredActivation } from '../../hooks/useDeferredActivation';

interface DeferredGoogleAnalyticsProps {
  gaId: string;
  debugMode?: boolean;
}

/**
 * Loads GA after the first interaction or a hard timeout so gtag never competes
 * with LCP / Speed Index on the critical path.
 */
const DeferredGoogleAnalytics = ({
  gaId,
  debugMode = false,
}: DeferredGoogleAnalyticsProps): React.JSX.Element | null => {
  const shouldLoad = useDeferredActivation();

  if (!shouldLoad) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} debugMode={debugMode} />;
};

export default DeferredGoogleAnalytics;
