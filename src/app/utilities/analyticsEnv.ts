/**
 * Client/server-safe gate for product analytics.
 * On Vercel, only the Production environment is enabled (not Preview/Development).
 * Local and other hosts never emit analytics.
 */
export function isProductionAnalyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
}
