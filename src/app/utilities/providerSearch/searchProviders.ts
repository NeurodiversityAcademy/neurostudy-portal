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

export function classifyProviderSearchTier(
  provider: ProviderSearchRecord,
): ProviderSearchTier | null {
  if (provider.kind === 'emerging') {
    return 'emerging';
  }
  if (provider.hasPromotedCourses) {
    return 'course_endorsed';
  }
  if (provider.ndaCertified) {
    return 'starred_endorsed';
  }
  if (provider.kind === 'endorsed') {
    return 'endorsed';
  }
  return null;
}

function sortProvidersByName(providers: ProviderSearchRecord[]): ProviderSearchRecord[] {
  return [...providers].sort((a, b) => a.name.localeCompare(b.name));
}

export function emptyProviderSearchTierResults(): ProviderSearchTierResults {
  return {
    course_endorsed: [],
    starred_endorsed: [],
    endorsed: [],
    emerging: [],
  };
}

export function searchProvidersByFilters(
  providers: readonly ProviderSearchRecord[],
  filters: ProviderSearchFilters,
): ProviderSearchTierResults {
  const results = emptyProviderSearchTierResults();

  if (filters.interestAreas.length === 0 && filters.locations.length === 0) {
    return results;
  }

  for (const provider of providers) {
    if (!matchesProviderSearchFilters(provider, filters)) {
      continue;
    }
    const tier = classifyProviderSearchTier(provider);
    if (tier === null) {
      continue;
    }
    results[tier].push(provider);
  }

  for (const tier of PROVIDER_SEARCH_TIER_ORDER) {
    results[tier] = sortProvidersByName(results[tier]);
  }

  return results;
}

export function countProviderSearchResults(results: ProviderSearchTierResults): number {
  return PROVIDER_SEARCH_TIER_ORDER.reduce((total, tier) => total + results[tier].length, 0);
}
