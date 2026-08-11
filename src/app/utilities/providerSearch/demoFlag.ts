import { PROVIDER_SEARCH_DEMO_PARAM_VALUE } from './constants';

export function isProviderSearchDemoEnabled(
  searchDemoParam: string | string[] | undefined,
): boolean {
  if (searchDemoParam === undefined) {
    return false;
  }
  const value = Array.isArray(searchDemoParam) ? searchDemoParam[0] : searchDemoParam;
  return value === PROVIDER_SEARCH_DEMO_PARAM_VALUE;
}
