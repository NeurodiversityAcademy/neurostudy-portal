type GoogleAnalyticsParams = Record<
  string,
  string | number | boolean | null | undefined
>;

interface Window {
  gtag?: (
    command: 'event',
    eventName: string,
    params?: GoogleAnalyticsParams
  ) => void;
}
