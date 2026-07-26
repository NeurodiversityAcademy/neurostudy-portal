import type { Metadata } from 'next';
import cardData from '@/app/components/emergingInstitutions/emergingInstitutions.json';
import type { HeroInfoItem } from '@/app/components/emergingInstitutions/InstitutionHero';
import type { ProviderStatItem } from '@/app/components/emergingInstitutions/EmergingProviderStats';
import {
  HERO_DETAILS_BY_SLUG,
  STATS_BY_SLUG,
  hasEmergingProviderProfile,
} from '@/app/components/emergingInstitutions/emergingProviderPageData';
import { buildComparedEduUndergraduateHref } from '@/app/components/emergingInstitutions/emergingProviderQiltSource';
import { EMERGING_PROVIDERS_DIRECTORY_PATH } from '@/app/components/emergingInstitutions/emergingProvidersPaths';
import { HOST_URL } from '@/app/utilities/constants';
import { slugify } from '@/app/utilities/common';

/** @deprecated Prefer `EMERGING_PROVIDERS_DIRECTORY_PATH` from `emergingProvidersPaths`. */
export const EMERGING_PROVIDERS_BASE_PATH = EMERGING_PROVIDERS_DIRECTORY_PATH;

type InstitutionCard = {
  name: string;
};

const INSTITUTIONS = cardData as InstitutionCard[];

const EMERGING_PROVIDER_BASE_KEYWORDS = [
  'NDA Emerging Providers',
  'NDA Emerging Provider',
  'Emerging Providers',
  'Neurodiversity Academy',
  'neuro-inclusive education',
  'neurodiversity',
] as const;

export interface ResolvedEmergingProvider {
  slug: string;
  name: string;
  heroInfoItems: HeroInfoItem[];
  providerStats: ProviderStatItem[];
  qiltSourceHref: string;
}

export function buildEmergingProviderDetailHref(slug: string): string {
  if (slug === '') {
    return '';
  }

  return `${EMERGING_PROVIDERS_DIRECTORY_PATH}/${slug}`;
}

export function listEmergingProviderNames(): string[] {
  return INSTITUTIONS.map((institution) => institution.name);
}

/** Directory/index keywords: shared terms + every listed institute name. */
export function buildEmergingProvidersDirectoryKeywords(): string[] {
  return [...EMERGING_PROVIDER_BASE_KEYWORDS, ...listEmergingProviderNames()];
}

/** Detail-page keywords: institute name first, then shared + full directory list. */
export function buildEmergingProviderDetailKeywords(providerName: string): string[] {
  return [
    providerName,
    `${providerName} NDA`,
    `${providerName} Emerging Provider`,
    ...EMERGING_PROVIDER_BASE_KEYWORDS,
    ...listEmergingProviderNames().filter((name) => name !== providerName),
  ];
}

export function listEmergingProviderSlugsWithProfiles(): string[] {
  return INSTITUTIONS.map((institution) => slugify(institution.name)).filter((slug) =>
    hasEmergingProviderProfile(slug),
  );
}

export function resolveEmergingProviderForSlug(slug: string): ResolvedEmergingProvider | null {
  const institution = INSTITUTIONS.find((item) => slugify(item.name) === slug);

  if (!institution || !hasEmergingProviderProfile(slug)) {
    return null;
  }

  const heroInfoItems = HERO_DETAILS_BY_SLUG[slug];
  const providerStats = STATS_BY_SLUG[slug];

  if (!heroInfoItems || !providerStats || providerStats.length === 0) {
    return null;
  }

  return {
    slug,
    name: institution.name,
    heroInfoItems,
    providerStats,
    qiltSourceHref: buildComparedEduUndergraduateHref(slug),
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
  const keywords = buildEmergingProviderDetailKeywords(provider.name);

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  };
}
