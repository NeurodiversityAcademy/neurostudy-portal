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

function splitPipeDelimited(raw: string): string[] {
  const tokens: string[] = [];
  for (const part of raw.split('|')) {
    const trimmed = part.trim();
    if (trimmed === '') {
      continue;
    }
    tokens.push(trimmed);
  }
  return tokens;
}

export function parseMultiQueryParam(value: string | string[] | undefined): string[] {
  if (value === undefined) {
    return [];
  }
  const rawValues = Array.isArray(value) ? value : [value];
  const tokens: string[] = [];
  for (const raw of rawValues) {
    tokens.push(...splitPipeDelimited(raw));
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

function isTooShortForPartialMatch(token: string): boolean {
  return token.length < MIN_PARTIAL_QUERY_LENGTH;
}

/** Shared partial/exact token compare used by matching and catalog expansion. */
export function tokensPartialMatch(left: string, right: string): boolean {
  const a = normalizeSearchToken(left);
  const b = normalizeSearchToken(right);
  if (isTooShortForPartialMatch(a)) {
    return false;
  }
  if (isTooShortForPartialMatch(b)) {
    return false;
  }
  if (a === b) {
    return true;
  }
  if (a.includes(b)) {
    return true;
  }
  if (b.includes(a)) {
    return true;
  }
  return false;
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
  if (isTooShortForPartialMatch(normalized)) {
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
