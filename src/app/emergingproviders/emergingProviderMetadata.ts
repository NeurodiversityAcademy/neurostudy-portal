import type { Metadata } from 'next';
import cardData from '@/app/components/emergingInstitutions/emergingInstitutions.json';
import type { HeroInfoItem } from '@/app/components/emergingInstitutions/InstitutionHero';
import type { ProviderStatItem } from '@/app/components/emergingInstitutions/EmergingProviderStats';
import {
  HERO_DETAILS_BY_SLUG,
  STATS_BY_SLUG,
} from '@/app/components/emergingInstitutions/emergingProviderPageData';
import { HOST_URL } from '@/app/utilities/constants';
import { slugify } from '@/app/utilities/common';

export const EMERGING_PROVIDERS_BASE_PATH = '/emergingproviders' as const;

type InstitutionCard = {
  name: string;
};

export interface ResolvedEmergingProvider {
  slug: string;
  name: string;
  heroInfoItems: HeroInfoItem[];
  providerStats: ProviderStatItem[];
}

export function buildEmergingProviderDetailHref(slug: string): string {
  if (slug === '') {
    return '';
  }

  return `${EMERGING_PROVIDERS_BASE_PATH}/${slug}`;
}

export function resolveEmergingProviderForSlug(slug: string): ResolvedEmergingProvider | null {
  const institutions = cardData as InstitutionCard[];
  const institution = institutions.find((item) => slugify(item.name) === slug);

  if (!institution) {
    return null;
  }

  const heroInfoItems = HERO_DETAILS_BY_SLUG[slug];
  const providerStats = STATS_BY_SLUG[slug];

  if (!heroInfoItems || !providerStats) {
    return null;
  }

  return {
    slug,
    name: institution.name,
    heroInfoItems,
    providerStats,
  };
}

export function buildEmergingProviderMetadata(slug: string): Metadata {
  const provider = resolveEmergingProviderForSlug(slug);

  if (!provider) {
    return { title: 'Not found' };
  }

  const title = `${provider.name} | NDA Emerging Provider`;
  const description = `Explore student experience insights and neuro-inclusive profile for ${provider.name}.`;
  const canonical = `${HOST_URL}${buildEmergingProviderDetailHref(slug)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  };
}
