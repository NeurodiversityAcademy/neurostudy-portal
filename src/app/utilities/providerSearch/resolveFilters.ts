import { loadProviderSearchContext, type ProviderSearchContext } from './catalog';
import { PROVIDER_SEARCH_QUERY, type ProviderSearchFilters } from './constants';
import { isProviderSearchDemoEnabled } from './demoFlag';
import { expandLocationValues } from './locationStates';
import { parseMultiQueryParam, resolveSearchFilterValues } from './normalize';

export type ProviderSearchPageParams = {
  [PROVIDER_SEARCH_QUERY.INTEREST_AREA]?: string | string[];
  [PROVIDER_SEARCH_QUERY.LOCATION]?: string | string[];
  [PROVIDER_SEARCH_QUERY.SEARCH_DEMO]?: string | string[];
  [PROVIDER_SEARCH_QUERY.UNMATCHED]?: string | string[];
};

const MAX_UNMATCHED_TERMS = 3;
const MAX_UNMATCHED_LENGTH = 40;

/** Re-sanitises the URL values: this text is rendered back to the user. */
function parseUnmatchedParam(value: string | string[] | undefined): string[] {
  const raw = value === undefined ? [] : Array.isArray(value) ? value : [value];
  return raw
    .flatMap((entry) => entry.split('|'))
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0 && entry.length <= MAX_UNMATCHED_LENGTH)
    .slice(0, MAX_UNMATCHED_TERMS);
}

export function resolveProviderSearchFilters(searchParams: ProviderSearchPageParams): {
  filters: ProviderSearchFilters;
  searchDemo: boolean;
  context: ProviderSearchContext;
  /** Words the assist could not map to an area or location. */
  unmatched: string[];
} {
  const searchDemo = isProviderSearchDemoEnabled(searchParams[PROVIDER_SEARCH_QUERY.SEARCH_DEMO]);
  const context = loadProviderSearchContext({ searchDemo });

  const filters: ProviderSearchFilters = {
    interestAreas: resolveSearchFilterValues(
      parseMultiQueryParam(searchParams[PROVIDER_SEARCH_QUERY.INTEREST_AREA]),
      context.interestAreaCatalog,
    ),
    // A city query must also reach state-tagged providers (and vice versa):
    // "Melbourne" → Melbourne | VIC, matching what the assist bar produces.
    locations: expandLocationValues(
      resolveSearchFilterValues(
        parseMultiQueryParam(searchParams[PROVIDER_SEARCH_QUERY.LOCATION]),
        context.locationCatalog,
      ),
      context.locationCatalog,
    ),
  };

  return {
    filters,
    searchDemo,
    context,
    unmatched: parseUnmatchedParam(searchParams[PROVIDER_SEARCH_QUERY.UNMATCHED]),
  };
}
