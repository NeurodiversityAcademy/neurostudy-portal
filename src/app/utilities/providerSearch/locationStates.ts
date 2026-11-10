import { normalizeSearchToken, uniqueSortedStrings } from './normalize';

/** Australian state/territory codes used by provider location tags. */
export const AU_STATE_CODES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const;

export type AuStateCode = (typeof AU_STATE_CODES)[number];

/**
 * Cities with a known state.
 *
 * Emerging providers are only tagged with a state and endorsed rows are often
 * only tagged with a city, so location filters are expanded across both.
 * Shared by the assist parser and URL filter resolution so both agree.
 */
export const CITY_TO_STATE: Record<string, AuStateCode> = {
  melbourne: 'VIC',
  geelong: 'VIC',
  sydney: 'NSW',
  newcastle: 'NSW',
  wollongong: 'NSW',
  brisbane: 'QLD',
  'gold coast': 'QLD',
  perth: 'WA',
  adelaide: 'SA',
  canberra: 'ACT',
  hobart: 'TAS',
  darwin: 'NT',
};

const STATE_CODE_SET = new Set<string>(AU_STATE_CODES);

/** Resolves the state for a city name or state code, or null when unknown. */
export function resolveLocationState(location: string): AuStateCode | null {
  const trimmed = location.trim();
  const cityState = CITY_TO_STATE[normalizeSearchToken(trimmed)];
  if (cityState) {
    return cityState;
  }

  const upper = trimmed.toUpperCase();
  return STATE_CODE_SET.has(upper) ? (upper as AuStateCode) : null;
}

/** Canonical catalog cities that belong to a state. */
export function listCitiesForState(state: string, catalog: readonly string[]): string[] {
  return catalog.filter((item) => CITY_TO_STATE[normalizeSearchToken(item)] === state);
}

/**
 * Expands each location to itself, its state and the catalog cities in that
 * state: "Melbourne" → Melbourne | VIC, "VIC" → VIC | Melbourne.
 * Unknown locations pass through untouched.
 */
export function expandLocationValues(
  selected: readonly string[],
  catalog: readonly string[],
): string[] {
  const expanded: string[] = [];

  for (const value of selected) {
    const state = resolveLocationState(value);
    if (!state) {
      expanded.push(value);
      continue;
    }

    expanded.push(value);
    if (normalizeSearchToken(value) !== normalizeSearchToken(state)) {
      expanded.push(state);
    }
    expanded.push(...listCitiesForState(state, catalog));
  }

  return uniqueSortedStrings(expanded);
}
