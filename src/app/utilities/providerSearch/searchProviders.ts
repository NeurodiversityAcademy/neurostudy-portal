import {
  PROVIDER_SEARCH_TIER_ORDER,
  type ProviderSearchFilters,
  type ProviderSearchRecord,
  type ProviderSearchTier,
  type ProviderSearchTierResults,
} from './constants';
import { matchesSearchToken } from './normalize';

export function matchesProviderSearchFilters(
  provider: ProviderSearchRecord,
  filters: ProviderSearchFilters,
): boolean {
  const selectedAreas = filters.interestAreas;
  const selectedLocations = filters.locations;

  const areaOk =
    selectedAreas.length === 0 ||
    selectedAreas.some((area) => matchesSearchToken(provider.interestAreas, area));
  const locationOk =
    selectedLocations.length === 0 ||
    selectedLocations.some((location) => matchesSearchToken(provider.locations, location));

  return areaOk && locationOk;
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

/** Certified endorsed providers always lead the endorsed list. */
function sortEndorsedProviders(providers: ProviderSearchRecord[]): ProviderSearchRecord[] {
  return [...providers].sort((a, b) => {
    if (a.ndaCertified !== b.ndaCertified) {
      return a.ndaCertified ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

export function emptyProviderSearchTierResults(): ProviderSearchTierResults {
  return {
    course_endorsed: [],
    endorsed: [],
    emerging: [],
  };
}

export function searchProvidersByFilters(
  providers: readonly ProviderSearchRecord[],
  filters: ProviderSearchFilters,
): ProviderSearchTierResults {
  const results = emptyProviderSearchTierResults();
  const browseAll = filters.interestAreas.length === 0 && filters.locations.length === 0;

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
