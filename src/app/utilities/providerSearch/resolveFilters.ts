import { loadProviderSearchContext, type ProviderSearchContext } from './catalog';
import { PROVIDER_SEARCH_QUERY, type ProviderSearchFilters } from './constants';
import { isProviderSearchDemoEnabled } from './demoFlag';
import { parseMultiQueryParam, resolveSearchFilterValues } from './normalize';

export type ProviderSearchPageParams = {
  [PROVIDER_SEARCH_QUERY.INTEREST_AREA]?: string | string[];
  [PROVIDER_SEARCH_QUERY.LOCATION]?: string | string[];
  [PROVIDER_SEARCH_QUERY.SEARCH_DEMO]?: string | string[];
};

export function resolveProviderSearchFilters(searchParams: ProviderSearchPageParams): {
  filters: ProviderSearchFilters;
  searchDemo: boolean;
  context: ProviderSearchContext;
} {
  const searchDemo = isProviderSearchDemoEnabled(searchParams[PROVIDER_SEARCH_QUERY.SEARCH_DEMO]);
  const context = loadProviderSearchContext({ searchDemo });

  const filters: ProviderSearchFilters = {
    interestAreas: resolveSearchFilterValues(
      parseMultiQueryParam(searchParams[PROVIDER_SEARCH_QUERY.INTEREST_AREA]),
      context.interestAreaCatalog,
    ),
    locations: resolveSearchFilterValues(
      parseMultiQueryParam(searchParams[PROVIDER_SEARCH_QUERY.LOCATION]),
      context.locationCatalog,
    ),
  };

  return { filters, searchDemo, context };
}
