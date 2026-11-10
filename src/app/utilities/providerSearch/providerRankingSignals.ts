import profileData from '@/app/components/emergingInstitutions/emergingProviderDocProfiles.json';
import {
  getInstitutionTypeForSlug,
  getSupportFrameworkForSlug,
} from '@/app/components/endorsedProviders/endorsedProviderPageData';
import type { ProviderSearchRecord } from './constants';
import {
  buildRankReason,
  computeQiltIndex,
  computeSupportCounts,
  type ProviderRankSignalMap,
  type ProviderRankSignals,
  type QiltIndex,
  type QiltStat,
} from './providerRanking';
import { classifyProviderSearchTier } from './searchProviders';

type ProfileRow = {
  slug: string;
  heroLocation: string;
  heroType: string;
  stats: QiltStat[];
};

const PROFILES = profileData as ProfileRow[];

/** QILT SES dimension order, matching `emergingProviderDocProfiles.json`. */
export const QILT_DIMENSION_TITLES = [
  'Overall experience',
  'Skills development',
  'Teaching quality',
  'Interactions with other students',
  'Facilities & resources',
  'Support & services',
] as const;

const PROFILE_BY_SLUG: ReadonlyMap<string, ProfileRow> = new Map(
  PROFILES.map((profile) => [profile.slug, profile]),
);

/**
 * QILT indices are static, so they are computed once per process.
 * A null entry means the profile exists but fewer than four dimensions parsed.
 */
const QILT_BY_SLUG: ReadonlyMap<string, QiltIndex> = (() => {
  const map = new Map<string, QiltIndex>();
  for (const profile of PROFILES) {
    const index = computeQiltIndex(profile.stats);
    if (index) {
      map.set(profile.slug, index);
    }
  }
  return map;
})();

/** Support-framework counts are derived from static data; cache per slug. */
const SUPPORT_BY_SLUG = new Map<string, ProviderRankSignals['support']>();

function supportForSlug(slug: string): ProviderRankSignals['support'] {
  if (SUPPORT_BY_SLUG.has(slug)) {
    return SUPPORT_BY_SLUG.get(slug) ?? null;
  }
  const sections = getSupportFrameworkForSlug(slug);
  const counts = computeSupportCounts(sections.flatMap((section) => section.items));
  SUPPORT_BY_SLUG.set(slug, counts);
  return counts;
}

export function getProviderRankSignals(slug: string): ProviderRankSignals {
  return {
    qilt: QILT_BY_SLUG.get(slug) ?? null,
    support: supportForSlug(slug),
  };
}

export type QiltStatRow = {
  title: string;
  value: string;
  nationalAverage: string;
  responses: string;
};

/** Per-dimension QILT rows for the comparison table. Empty for VET / unknown slugs. */
export function getQiltStatsForSlug(slug: string): QiltStatRow[] {
  const profile = PROFILE_BY_SLUG.get(slug);
  if (!profile) {
    return [];
  }
  return profile.stats.map((stat, index) => ({
    title: QILT_DIMENSION_TITLES[index] ?? `Dimension ${index + 1}`,
    value: stat.value,
    nationalAverage: stat.nationalAverage,
    responses: stat.responses ?? '',
  }));
}

/**
 * Server-side helper. Builds signals for the whole provider list once per request;
 * the underlying data is static, so this stays cheap.
 */
export function buildProviderRankSignals(
  providers: readonly ProviderSearchRecord[],
): ProviderRankSignalMap {
  const map = new Map<string, ProviderRankSignals>();
  for (const provider of providers) {
    map.set(provider.slug, getProviderRankSignals(provider.slug));
  }
  return map;
}

/** Card copy keyed by slug. Empty string means "render nothing". */
export function buildProviderRankReasons(
  providers: readonly ProviderSearchRecord[],
  signals: ProviderRankSignalMap,
): Record<string, string> {
  const reasons: Record<string, string> = {};
  for (const provider of providers) {
    reasons[provider.slug] = buildRankReason({
      tier: classifyProviderSearchTier(provider),
      signals: signals.get(provider.slug),
      isVet: getInstitutionTypeForSlug(provider.slug) === 'VET',
    });
  }
  return reasons;
}
