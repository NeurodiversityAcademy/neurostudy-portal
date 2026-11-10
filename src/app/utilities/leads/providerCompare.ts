import 'server-only';
import {
  getInstitutionTypeForSlug,
  getSupportFrameworkForSlug,
} from '@/app/components/endorsedProviders/endorsedProviderPageData';
import { loadProviderSearchContext } from '@/app/utilities/providerSearch/catalog';
import {
  getProviderRankSignals,
  getQiltStatsForSlug,
} from '@/app/utilities/providerSearch/providerRankingSignals';
import { classifyProviderSearchTier } from '@/app/utilities/providerSearch/searchProviders';
import { buildEndorsedProviderDetailHref } from '@/app/utilities/endorsedProvidersDemo';
import { buildEmergingProviderDetailHref } from '@/app/emergingproviders/emergingProviderMetadata';
import { hasEmergingProviderProfile } from '@/app/components/emergingInstitutions/emergingProviderProfileSlugs';
import type { CompareProviderPayload } from './shortlistTypes';

export type CompareProvider = CompareProviderPayload;

const PROVIDERS_BY_SLUG = new Map(
  loadProviderSearchContext().providers.map((provider) => [provider.slug, provider]),
);

export function isKnownProviderSlug(slug: string): boolean {
  return PROVIDERS_BY_SLUG.has(slug);
}

export function buildCompareProvider(slug: string): CompareProvider | null {
  const provider = PROVIDERS_BY_SLUG.get(slug);
  if (!provider) {
    return null;
  }

  const tier = classifyProviderSearchTier(provider);
  const signals = getProviderRankSignals(slug);
  const isEndorsed = provider.kind === 'endorsed';

  const detailHref = isEndorsed
    ? buildEndorsedProviderDetailHref(slug, '')
    : hasEmergingProviderProfile(slug)
      ? buildEmergingProviderDetailHref(slug)
      : '';

  return {
    slug: provider.slug,
    name: provider.name,
    tier,
    type: isEndorsed ? getInstitutionTypeForSlug(slug) : 'Emerging provider',
    locations: provider.locations,
    ndaCertified: provider.ndaCertified,
    supportInPlace: signals.support?.inPlace ?? null,
    supportInWorks: signals.support?.inWorks ?? null,
    supportSections: isEndorsed
      ? getSupportFrameworkForSlug(slug).map((section) => ({
          title: section.section,
          items: section.items.map((item) => ({ label: item.label, status: item.status })),
        }))
      : [],
    qilt: signals.qilt
      ? {
          points: signals.qilt.points,
          dims: signals.qilt.dims,
          responses: signals.qilt.responses,
          stats: getQiltStatsForSlug(slug),
        }
      : null,
    detailHref,
  };
}
