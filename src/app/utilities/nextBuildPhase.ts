/**
 * True while Next.js runs `next build` and preloads route modules.
 * Server secrets are often unset during CI/build; validate at runtime instead.
 */
export const isNextProductionBuildPhase =
  process.env.NEXT_PHASE === 'phase-production-build';
