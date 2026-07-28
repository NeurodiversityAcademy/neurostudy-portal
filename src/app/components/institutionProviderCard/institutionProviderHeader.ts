import type { AustralianState } from '../emergingInstitutions/emergingInstitutionTypes';

/**
 * Shared (server-safe) header kinds for InstitutionProviderCard.
 * Keep out of the `'use client'` module so Server Components can pass `kind`
 * without it being stripped during RSC serialization.
 */
export const INSTITUTION_PROVIDER_HEADER_KIND = {
  EMERGING_DEFAULT: 'emergingDefault',
  YELLOW: 'yellow',
  CHERRY_PIE_SUB: 'cherryPieSub',
  REMOTE_IMAGE: 'remoteImage',
} as const;

export type InstitutionProviderHeader =
  | {
      kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT;
      /** Soft header tint so dense grids scan by state. */
      stateTint?: AustralianState;
    }
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.YELLOW }
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.CHERRY_PIE_SUB }
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE; src: string };
