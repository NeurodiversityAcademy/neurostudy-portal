'use client';

import Script from 'next/script';
import type { ReactElement } from 'react';
import useDeferredThirdPartyLoad from '@/app/hooks/useDeferredThirdPartyLoad';
import {
  TABNAV_WIDGET_CONFIG_JSON,
  TABNAV_WIDGET_SCRIPT_SRC,
} from './tabNavConstants';

/**
 * TabNav accessibility widget loader (third-party).
 * Deferred until interaction / idle fallback to avoid third-party cookies on first paint.
 * Props match TabNav dashboard snippet; see tabNavConstants for regression-locked values.
 */
export default function TabNavEmbed(): ReactElement {
  const shouldLoad = useDeferredThirdPartyLoad();

  return (
    <>
      {shouldLoad ? (
        <Script
          id='tabnav-accessibility-widget'
          src={TABNAV_WIDGET_SCRIPT_SRC}
          strategy='lazyOnload'
          tnv-data-config={TABNAV_WIDGET_CONFIG_JSON}
        />
      ) : null}
      <noscript>
        JavaScript is required for{' '}
        <a href='https://tabnav.com/accessibility-widget'>
          accessibility widget
        </a>{' '}
        to work properly.
      </noscript>
    </>
  );
}
