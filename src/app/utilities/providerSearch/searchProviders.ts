import {
  PROVIDER_SEARCH_TIER_ORDER,
  type ProviderSearchFilters,
  type ProviderSearchRecord,
  type ProviderSearchTier,
  type ProviderSearchTierResults,
} from './constants';
import { matchesSearchToken } from './normalize';

function fieldAllowsEmptyOrMatch(
  selected: readonly string[],
  haystack: readonly string[],
): boolean {
  if (selected.length === 0) {
    return true;
  }
  return selected.some((token) => matchesSearchToken(haystack, token));
}

export function matchesProviderSearchFilters(
  provider: ProviderSearchRecord,
  filters: ProviderSearchFilters,
): boolean {
  const areaOk = fieldAllowsEmptyOrMatch(filters.interestAreas, provider.interestAreas);
  const locationOk = fieldAllowsEmptyOrMatch(filters.locations, provider.locations);
  if (!areaOk) {
    return false;
  }
  if (!locationOk) {
    return false;
  }
  return true;
}

export function classifyProviderSearchTier(provider: ProviderSearchRecord): ProviderSearchTier {
  if (provider.kind === 'emerging') {
    return 'emerging';
  }
  if (provider.hasPromotedCourses) {
    return 'course_endorsed';
  }
  return 'endorsed';
}

function sortProvidersByName(providers: ProviderSearchRecord[]): ProviderSearchRecord[] {
  return [...providers].sort((a, b) => a.name.localeCompare(b.name));
}

function compareCertifiedFirst(a: ProviderSearchRecord, b: ProviderSearchRecord): number {
  if (a.ndaCertified === b.ndaCertified) {
    return a.name.localeCompare(b.name);
  }
  if (a.ndaCertified) {
    return -1;
  }
  return 1;
}

/** Certified endorsed providers always lead the endorsed list. */
function sortEndorsedProviders(providers: ProviderSearchRecord[]): ProviderSearchRecord[] {
  return [...providers].sort(compareCertifiedFirst);
}

export function emptyProviderSearchTierResults(): ProviderSearchTierResults {
  return {
    course_endorsed: [],
    endorsed: [],
    emerging: [],
  };
}

function hasActiveFilters(filters: ProviderSearchFilters): boolean {
  if (filters.interestAreas.length > 0) {
    return true;
  }
  if (filters.locations.length > 0) {
    return true;
  }
  return false;
}

export function searchProvidersByFilters(
  providers: readonly ProviderSearchRecord[],
  filters: ProviderSearchFilters,
): ProviderSearchTierResults {
  const results = emptyProviderSearchTierResults();
  const browseAll = !hasActiveFilters(filters);

  for (const provider of providers) {
    if (!browseAll && !matchesProviderSearchFilters(provider, filters)) {
      continue;
    }
    results[classifyProviderSearchTier(provider)].push(provider);
  }

  results.course_endorsed = sortProvidersByName(results.course_endorsed);
  results.endorsed = sortEndorsedProviders(results.endorsed);
  results.emerging = sortProvidersByName(results.emerging);

  return results;
}

export function countProviderSearchResults(results: ProviderSearchTierResults): number {
  return PROVIDER_SEARCH_TIER_ORDER.reduce((total, tier) => total + results[tier].length, 0);
}

export function countStarredEndorsedResults(results: ProviderSearchTierResults): number {
  return results.endorsed.filter((provider) => provider.ndaCertified).length;
}

export type PositionedProviderSearchResult = {
  provider: ProviderSearchRecord;
  tier: ProviderSearchTier;
  position: number;
};

/** Pure position assignment for result cards (no render-time mutation). */
export function listPositionedProviderSearchResults(
  results: ProviderSearchTierResults,
): PositionedProviderSearchResult[] {
  const positioned: PositionedProviderSearchResult[] = [];
  let position = 0;
  for (const tier of PROVIDER_SEARCH_TIER_ORDER) {
    for (const provider of results[tier]) {
      position += 1;
      positioned.push({ provider, tier, position });
    }
  }
  return positioned;
}
