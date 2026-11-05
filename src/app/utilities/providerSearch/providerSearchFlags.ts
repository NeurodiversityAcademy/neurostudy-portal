/**
 * Build-time feature flag for the recommendation/evidence layer.
 *
 * Unset means enabled, so a normal deploy ships the feature. Set
 * `NEXT_PUBLIC_RECOMMENDATIONS_ENABLED=false` and redeploy to restore the
 * historical alphabetical/certified-first order and hide the evidence chips.
 */
export function isRecommendationsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RECOMMENDATIONS_ENABLED !== 'false';
}
