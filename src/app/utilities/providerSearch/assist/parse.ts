import type { ProviderSearchContext } from '@/app/utilities/providerSearch/catalog';
import {
  CITY_TO_STATE,
  listCitiesForState,
  resolveLocationState,
} from '@/app/utilities/providerSearch/locationStates';
import {
  normalizeSearchToken,
  uniqueSortedStrings,
} from '@/app/utilities/providerSearch/normalize';

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
  if (!normalizedText) {
    return [];
  }

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
    const itemTokens = normalizeSearchToken(item)
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
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
  const state = resolveLocationState(location);
  if (!state) {
    return [location];
  }

  const cityState = CITY_TO_STATE[normalizeSearchToken(location)];

  return uniqueSortedStrings([
    cityState ? location : state,
    state,
    ...listCitiesForState(state, catalog),
  ]);
}

/**
 * Location-only search, e.g. "study in melbourne".
 *
 * Deliberately separate from `tryKeywordHit`: the eval contract requires
 * location-only queries to reach the model (`hit === null`), so this is used
 * as the route's fallback when the model finds no area or location.
 */
export function tryLocationOnlyHit(text: string, ctx: ProviderSearchContext): string[] | null {
  const locations = detectInText(text, ctx.locationCatalog);
  if (locations.length !== 1) {
    return null;
  }

  return expandLocations(locations[0], ctx.locationCatalog);
}

/**
 * Area-only search, e.g. "nursing": results for every location.
 *
 * Only exact catalog labels and whole-word aliases count, so partial input
 * such as "nurs" still falls through to suggestions instead of results.
 */
export function tryAreaOnlyHit(text: string, ctx: ProviderSearchContext): string | null {
  const haystack = normalizeSearchToken(text);
  const exact = ctx.interestAreaCatalog.filter((area) => {
    const needle = normalizeSearchToken(area);
    return (
      needle.length >= 3 &&
      new RegExp(`(^|[^a-z0-9])${escapeRegExp(needle)}([^a-z0-9]|$)`).test(haystack)
    );
  });
  if (exact.length > 0) {
    return exact.length === 1 ? exact[0] : null;
  }

  const words = new Set(haystack.split(/[^a-z0-9]+/).filter(Boolean));
  const aliased = uniqueSortedStrings(
    Object.entries(FUZZY_AREA_ALIASES)
      .filter(([alias]) => words.has(normalizeSearchToken(alias)))
      .flatMap(([, candidates]) =>
        candidates.filter((candidate) =>
          ctx.interestAreaCatalog.some(
            (area) => normalizeSearchToken(area) === normalizeSearchToken(candidate),
          ),
        ),
      ),
  );
  return aliased.length === 1 ? aliased[0] : null;
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

/**
 * A real search slot is an exact catalog label or a known alias — not a loose
 * token match. The catalog contains broad free-text rows ("… university …"),
 * so token matching would treat "best university" as a searchable intent.
 * Location labels such as SA/WA are two characters but are still real slots.
 */
function hasSearchSlot(text: string, ctx: ProviderSearchContext): boolean {
  const haystack = normalizeSearchToken(text);

  const exactMatch = (catalog: readonly string[], minLength: number) =>
    catalog.some((item) => {
      const needle = normalizeSearchToken(item);
      if (needle.length < minLength) {
        return false;
      }
      return new RegExp(`(^|[^a-z0-9])${escapeRegExp(needle)}([^a-z0-9]|$)`).test(haystack);
    });

  return (
    exactMatch(ctx.interestAreaCatalog, 3) ||
    exactMatch(ctx.locationCatalog, 2) ||
    aliasMatches(text, ctx.interestAreaCatalog).length > 0
  );
}

export type OutOfScopeReason = 'generative' | 'injection' | 'advice_no_slot';

/**
 * Classifies a deterministic refusal with a stable reason code.
 * The route logs the reason; it never returns this text to the client.
 */
export function classifyOutOfScope(
  text: string,
  ctx: ProviderSearchContext,
): OutOfScopeReason | null {
  const lowercase = text.toLowerCase();

  // Writing/coding/injection is refused even when it mentions a catalog area.
  if (GENERATIVE.test(lowercase)) {
    return 'generative';
  }
  if (INJECTION.test(lowercase)) {
    return 'injection';
  }

  // Advice/comparison is refused only when there is nothing to search on.
  // "best nursing in Sydney" stays a search: results, never advice.
  if (ADVICE.test(lowercase) && !hasSearchSlot(text, ctx)) {
    return 'advice_no_slot';
  }

  return null;
}

export function isOutOfScope(text: string, ctx: ProviderSearchContext): boolean {
  return classifyOutOfScope(text, ctx) !== null;
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
