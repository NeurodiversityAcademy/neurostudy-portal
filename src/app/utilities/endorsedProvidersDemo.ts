import {
  ENDORSED_PROVIDERS_BASE_PATH,
  buildEndorsedDemoDetailHref,
  buildEndorsedLiveDetailHref,
} from '@/app/utilities/demoAccess';
import { isLiveEndorsedSlug } from '@/app/components/endorsedProviders/endorsedProviderPageData';

import type { StaticImageData } from 'next/image';

export const ENDORSED_PROVIDERS_SECTION_ID = 'nda-endorsed-providers' as const;

export const ENDORSED_PROVIDERS_HEADING = 'NDA Endorsed Providers' as const;

export const ENDORSED_PROVIDERS_SUBTITLE =
  'Endorsed Providers meet Neurodiversity Academy standards for neuro-inclusive education and practice.' as const;

export const ENDORSED_PROVIDERS_BADGE_ALT =
  'Endorsed Learning Organisation' as const;

export const ENDORSED_PROVIDERS_GA = {
  ctaClick: {
    eventName: 'endorsed_cta_click',
    category: 'Endorsed',
    section: 'endorsed_providers_cards',
  },
} as const;

export function resolveEndorsedProviderLogoSrc(
  providerSlug: string,
  fallbackLogo: string,
  logoBySlug: Record<string, StaticImageData>
): string | StaticImageData {
  if (!Object.prototype.hasOwnProperty.call(logoBySlug, providerSlug)) {
    return fallbackLogo;
  }
  return logoBySlug[providerSlug];
}

export function buildEndorsedProviderDetailHref(
  providerSlug: string,
  demoGuid: string
): string {
  if (isLiveEndorsedSlug(providerSlug)) {
    return buildEndorsedLiveDetailHref(providerSlug);
  }

  return buildEndorsedDemoDetailHref(demoGuid);
}

export { ENDORSED_PROVIDERS_BASE_PATH };
