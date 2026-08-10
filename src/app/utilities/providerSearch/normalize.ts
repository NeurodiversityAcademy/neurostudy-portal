export function normalizeSearchToken(value: string): string {
  return value.trim().toLowerCase();
}

export function uniqueSortedStrings(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed === '') {
      continue;
    }
    const key = normalizeSearchToken(trimmed);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(trimmed);
  }
  return result.sort((a, b) => a.localeCompare(b));
}

export function parseMultiQueryParam(value: string | string[] | undefined): string[] {
  if (value === undefined) {
    return [];
  }
  const rawValues = Array.isArray(value) ? value : [value];
  const tokens: string[] = [];
  for (const raw of rawValues) {
    for (const part of raw.split('|')) {
      const trimmed = part.trim();
      if (trimmed !== '') {
        tokens.push(trimmed);
      }
    }
  }
  return uniqueSortedStrings(tokens);
}

export function joinGaMultiValue(values: readonly string[]): string {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .join('|');
}

const MIN_PARTIAL_QUERY_LENGTH = 2;

/** Shared partial/exact token compare used by matching and catalog expansion. */
export function tokensPartialMatch(left: string, right: string): boolean {
  const a = normalizeSearchToken(left);
  const b = normalizeSearchToken(right);
  if (a.length < MIN_PARTIAL_QUERY_LENGTH || b.length < MIN_PARTIAL_QUERY_LENGTH) {
    return false;
  }
  return a === b || a.includes(b) || b.includes(a);
}

/**
 * Partial match: "digital" matches "Digital Skills" and "Digital Technology".
 * Exact matches still work.
 */
export function matchesSearchToken(haystack: readonly string[], needle: string): boolean {
  return haystack.some((item) => tokensPartialMatch(item, needle));
}

function expandSelectedValue(value: string, catalog: readonly string[]): string[] {
  const normalized = normalizeSearchToken(value);
  if (normalized.length < MIN_PARTIAL_QUERY_LENGTH) {
    return [];
  }

  const exact = catalog.find((item) => normalizeSearchToken(item) === normalized);
  if (exact) {
    return [exact];
  }

  const partialMatches = catalog.filter((item) => tokensPartialMatch(item, value));
  if (partialMatches.length > 0) {
    return partialMatches;
  }

  return [value.trim()];
}

/** Expand free-text / partial queries onto catalog labels when possible. */
export function resolveSearchFilterValues(
  selected: readonly string[],
  catalog: readonly string[],
): string[] {
  return uniqueSortedStrings(selected.flatMap((value) => expandSelectedValue(value, catalog)));
}

/** Merge committed selections with in-progress typed draft (e.g. "business"). */
export function mergeSearchTokens(selected: readonly string[], draft: string): string[] {
  const trimmed = draft.trim();
  if (trimmed === '') {
    return uniqueSortedStrings(selected);
  }
  return uniqueSortedStrings([...selected, trimmed]);
}
