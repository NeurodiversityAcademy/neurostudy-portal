import Script from 'next/script';
import {
  TABNAV_WIDGET_CONFIG_JSON,
  TABNAV_WIDGET_SCRIPT_SRC,
} from './tabNavConstants';

/**
 * TabNav accessibility widget loader (third-party).
 * Props match TabNav dashboard snippet; see tabNavConstants for regression-locked values.
 */
export default function TabNavEmbed(): JSX.Element {
  return (
    <>
      <Script
        id='tabnav-accessibility-widget'
        src={TABNAV_WIDGET_SCRIPT_SRC}
        strategy='lazyOnload'
        tnv-data-config={TABNAV_WIDGET_CONFIG_JSON}
      />
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
