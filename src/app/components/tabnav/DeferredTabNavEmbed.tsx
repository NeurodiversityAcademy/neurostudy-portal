'use client';

import Script from 'next/script';
import { useDeferredActivation } from '../../hooks/useDeferredActivation';
import { TABNAV_WIDGET_SCRIPT_SRC } from './tabNavConstants';

/**
 * Loads TabNav after interaction or a hard timeout so the widget never competes
 * with first paint / Speed Index on the critical path.
 */
const DeferredTabNavEmbed = (): React.JSX.Element | null => {
  const shouldLoad = useDeferredActivation();

  if (!shouldLoad) {
    return null;
  }

  return <Script src={TABNAV_WIDGET_SCRIPT_SRC} strategy='lazyOnload' />;
};

export default DeferredTabNavEmbed;
