import type { StaticImageData } from 'next/image';
import blueprintLargeLogo from '@/app/images/emergingInstitutions/blueprint-large-logo.png';
import collartsLargeLogo from '@/app/images/emergingInstitutions/collarts-large-logo.png';
import hshLargeLogo from '@/app/images/emergingInstitutions/hsh-large-logo.png';
import napeanLargeLogo from '@/app/images/emergingInstitutions/napean-large-logo.png';

/** Large marks from `src/app/images/emergingInstitutions/` — keyed by `slugify(provider.id)`. */
export const ENDORSED_PROVIDER_LOGO_BY_SLUG: Record<string, StaticImageData> = {
  hsh: hshLargeLogo,
  'blueprint-career-development': blueprintLargeLogo,
  collarts: collartsLargeLogo,
  'nepean-community-college': napeanLargeLogo,
};
