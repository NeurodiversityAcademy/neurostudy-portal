import type { ProviderSearchContext } from '@/app/utilities/providerSearch/catalog';
import {
  normalizeSearchToken,
  uniqueSortedStrings,
} from '@/app/utilities/providerSearch/normalize';

const CITY_TO_STATE: Record<string, string> = {
  melbourne: 'VIC',
  sydney: 'NSW',
  brisbane: 'QLD',
  perth: 'WA',
  adelaide: 'SA',
  newcastle: 'NSW',
  canberra: 'ACT',
  hobart: 'TAS',
  darwin: 'NT',
  'gold coast': 'QLD',
  wollongong: 'NSW',
  geelong: 'VIC',
};

const STATES = new Set(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']);

const FUZZY_AREA_ALIASES: Record<string, string[]> = {
  creative: ['Creative Industries', 'Design'],
  media: ['Screen Media', 'Screen/Media/Games', 'Media & Communication'],
  film: ['Screen Media', 'Screen/Media/Games'],
  design: ['Design', 'Creative Industries'],
  nursing: ['Nursing'],
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function aliasMatches(text: string, catalog: string[]): string[] {
  const normalizedText = normalizeSearchToken(text);
  const matches = new Set<string>();

  for (const [alias, candidates] of Object.entries(FUZZY_AREA_ALIASES)) {
    const normalizedAlias = normalizeSearchToken(alias);
    if (!normalizedText.includes(normalizedAlias) && !normalizedAlias.includes(normalizedText)) {
      continue;
    }

    for (const candidate of candidates) {
      const normalizedCandidate = normalizeSearchToken(candidate);
      if (catalog.some((entry) => normalizeSearchToken(entry) === normalizedCandidate)) {
        matches.add(candidate);
      }
    }
  }

  return uniqueSortedStrings([...matches]);
}

function resolveAreaMatch(text: string, catalog: string[]): string | null {
  const aliasCandidates = aliasMatches(text, catalog);
  if (aliasCandidates.length > 0) {
    return aliasCandidates[0];
  }

  const matches = detectInText(text, catalog);
  if (matches.length === 1) {
    return matches[0];
  }

  return null;
}

export function detectInText(text: string, catalog: string[]): string[] {
  const haystack = normalizeSearchToken(text);
  const directMatches = catalog.filter((item) => {
    const needle = normalizeSearchToken(item);
    if (needle.length < 3) {
      return false;
    }
    const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(needle)}([^a-z0-9]|$)`);
    return pattern.test(haystack);
  });

  if (directMatches.length > 0) {
    return directMatches;
  }

  const fuzzyMatches = aliasMatches(text, catalog);
  if (fuzzyMatches.length > 0) {
    return fuzzyMatches;
  }

  const queryTokens = haystack.split(/[^a-z0-9]+/).filter(Boolean);
  if (queryTokens.length === 0) {
    return [];
  }

  return catalog.filter((item) => {
    const itemTokens = normalizeSearchToken(item).split(/[^a-z0-9]+/).filter(Boolean);
    if (itemTokens.length === 0) {
      return false;
    }

    return queryTokens.some((token) =>
      itemTokens.some(
        (itemToken) =>
          itemToken === token ||
          itemToken.startsWith(token) ||
          token.startsWith(itemToken) ||
          itemToken.includes(token) ||
          token.includes(itemToken),
      ),
    );
  });
}

export function expandLocations(location: string, catalog: string[]): string[] {
  const key = normalizeSearchToken(location);
  const state = CITY_TO_STATE[key] ?? (STATES.has(location) ? location : null);
  if (!state) {
    return [location];
  }

  return uniqueSortedStrings([
    location,
    state,
    ...catalog.filter((item) => CITY_TO_STATE[normalizeSearchToken(item)] === state),
  ]);
}

export function tryKeywordHit(
  text: string,
  ctx: ProviderSearchContext,
): { area: string; locations: string[] } | null {
  const area = resolveAreaMatch(text, ctx.interestAreaCatalog);
  const locations = detectInText(text, ctx.locationCatalog);
  if (!area || locations.length !== 1) {
    return null;
  }

  return {
    area,
    locations: expandLocations(locations[0], ctx.locationCatalog),
  };
}

const GENERATIVE =
  /\b(write|essay|story|poem|joke|translate|summarise|summarize|explain|code|script|debug|recipe|homework)\b/i;
const INJECTION =
  /\b(ignore (all )?(previous|prior|above)|system prompt|you are now|jailbreak|act as)\b/i;
const ADVICE =
  /\b(best|better|recommend|should i|which (uni|university|provider|one)|compare|versus|vs\.?|ranking|rank|worth it|review|opinion|advice|pros and cons)\b/i;

export function isOutOfScope(text: string): boolean {
  const lowercase = text.toLowerCase();
  if (GENERATIVE.test(lowercase) || INJECTION.test(lowercase)) {
    return true;
  }
  if (ADVICE.test(lowercase) && !/[a-z]{3,}/.test(lowercase)) {
    return true;
  }
  return false;
}

export function suggestAreas(text: string, ctx: ProviderSearchContext): string[] {
  const tokens = normalizeSearchToken(text)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3);

  if (tokens.length === 0) {
    return [];
  }

  const matches = ctx.interestAreaCatalog.filter((area) => {
    const normalized = normalizeSearchToken(area);
    return tokens.some(
      (token) =>
        normalized.includes(token) ||
        token.includes(normalized) ||
        normalized.split(/\s+/).some((part) => part === token || token.includes(part)),
    );
  });

  return uniqueSortedStrings(matches).slice(0, 6);
}
