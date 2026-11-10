/**
 * The shortlist gate stays available in-product by default. In local development,
 * we explicitly allow the inline compare flow even when the app is still using a
 * local-only environment configuration.
 */
export function isLeadCaptureEnabled(): boolean {
  const localEnvironment =
    process.env.NODE_ENV === 'development' &&
    (process.env.APP_ENV === 'local' || process.env.NEXT_PUBLIC_APP_ENV === 'local');

  return localEnvironment || process.env.LEAD_CAPTURE_ENABLED !== 'false';
}
