import { getProviderSearchInterestAreaCatalog, getProviderSearchLocationCatalog } from './catalog';
import { PROVIDER_SEARCH_QUERY, type ProviderSearchFilters } from './constants';
import { parseMultiQueryParam, resolveSearchFilterValues } from './normalize';
import { isProviderSearchDemoEnabled } from './buildSearchHref';

export type ProviderSearchPageParams = {
  [PROVIDER_SEARCH_QUERY.INTEREST_AREA]?: string | string[];
  [PROVIDER_SEARCH_QUERY.LOCATION]?: string | string[];
  [PROVIDER_SEARCH_QUERY.SEARCH_DEMO]?: string | string[];
};

export function resolveProviderSearchFilters(searchParams: ProviderSearchPageParams): {
  filters: ProviderSearchFilters;
  searchDemo: boolean;
} {
  const searchDemo = isProviderSearchDemoEnabled(searchParams[PROVIDER_SEARCH_QUERY.SEARCH_DEMO]);
  const areaCatalog = getProviderSearchInterestAreaCatalog({ searchDemo });
  const locationCatalog = getProviderSearchLocationCatalog({ searchDemo });

  const filters: ProviderSearchFilters = {
    interestAreas: resolveSearchFilterValues(
      parseMultiQueryParam(searchParams[PROVIDER_SEARCH_QUERY.INTEREST_AREA]),
      areaCatalog,
    ),
    locations: resolveSearchFilterValues(
      parseMultiQueryParam(searchParams[PROVIDER_SEARCH_QUERY.LOCATION]),
      locationCatalog,
    ),
  };

  return { filters, searchDemo };
}
