import type { SearchParams } from '@/app/utilities/featureToggle';

export const EMPTY_SEARCH_PARAMS: SearchParams = {};

export function readFirstSearchParamValue(
  searchParams: SearchParams,
  paramKey: string,
): string | null {
  if (paramKey === '') {
    return null;
  }

  if (!Object.prototype.hasOwnProperty.call(searchParams, paramKey)) {
    return null;
  }

  const raw = searchParams[paramKey];
  const val = Array.isArray(raw) ? raw[0] : raw;
  if (typeof val !== 'string' || val === '') {
    return null;
  }

  return val;
}
