export type GoogleAnalyticsParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export function trackGoogleAnalyticsEvent(
  eventName: string,
  params?: GoogleAnalyticsParams
) {
  if (typeof window === 'undefined') {
    return;
  }

  window.gtag?.('event', eventName, params);
}
