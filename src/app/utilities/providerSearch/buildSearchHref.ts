import {
  PROVIDER_SEARCH_PATH,
  PROVIDER_SEARCH_QUERY,
  PROVIDER_SEARCH_DEMO_PARAM_VALUE,
  type ProviderSearchFilters,
} from './constants';

function appendMultiParam(params: URLSearchParams, key: string, values: readonly string[]): void {
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed !== '') {
      params.append(key, trimmed);
    }
  }
}

export function buildProviderSearchHref(
  filters: ProviderSearchFilters,
  options?: { searchDemo?: boolean },
): string {
  const params = new URLSearchParams();
  appendMultiParam(params, PROVIDER_SEARCH_QUERY.INTEREST_AREA, filters.interestAreas);
  appendMultiParam(params, PROVIDER_SEARCH_QUERY.LOCATION, filters.locations);
  if (options?.searchDemo) {
    params.set(PROVIDER_SEARCH_QUERY.SEARCH_DEMO, PROVIDER_SEARCH_DEMO_PARAM_VALUE);
  }
  const query = params.toString();
  return query === '' ? PROVIDER_SEARCH_PATH : `${PROVIDER_SEARCH_PATH}?${query}`;
}

export function buildEndorsedCoursesHref(slug: string, options?: { searchDemo?: boolean }): string {
  const base = `/endorsedproviders/${slug}/courses`;
  if (!options?.searchDemo) {
    return base;
  }
  return `${base}?${PROVIDER_SEARCH_QUERY.SEARCH_DEMO}=${PROVIDER_SEARCH_DEMO_PARAM_VALUE}`;
}

export function isProviderSearchDemoEnabled(
  searchDemoParam: string | string[] | undefined,
): boolean {
  if (searchDemoParam === undefined) {
    return false;
  }
  const value = Array.isArray(searchDemoParam) ? searchDemoParam[0] : searchDemoParam;
  return value?.toLowerCase() === PROVIDER_SEARCH_DEMO_PARAM_VALUE;
}
