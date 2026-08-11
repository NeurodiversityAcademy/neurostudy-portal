import { uniqueSortedStrings } from './normalize';

/** City → AU state for search location enrichment. */
const CITY_TO_STATE: Record<string, string> = {
  adelaide: 'SA',
  brisbane: 'QLD',
  canberra: 'ACT',
  darwin: 'NT',
  hobart: 'TAS',
  melbourne: 'VIC',
  newcastle: 'NSW',
  penrith: 'NSW',
  perth: 'WA',
  sydney: 'NSW',
  townsville: 'QLD',
  woolloongabba: 'QLD',
};

const AU_STATES = new Set(['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA']);

function stateForLocationToken(token: string): string | undefined {
  const trimmed = token.trim();
  if (trimmed === '') {
    return undefined;
  }
  const upper = trimmed.toUpperCase();
  if (AU_STATES.has(upper)) {
    return upper;
  }
  return CITY_TO_STATE[trimmed.toLowerCase()];
}

/** Ensure city tags also expose their AU state for state-level search. */
export function withDerivedLocationStates(locations: readonly string[]): string[] {
  const withStates: string[] = [...locations];
  for (const location of locations) {
    const state = stateForLocationToken(location);
    if (state) {
      withStates.push(state);
    }
  }
  return uniqueSortedStrings(withStates);
}
