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

/** Exact case-insensitive equality. */
export function includesNormalized(haystack: readonly string[], needle: string): boolean {
  const normalizedNeedle = normalizeSearchToken(needle);
  return haystack.some((item) => normalizeSearchToken(item) === normalizedNeedle);
}

const MIN_PARTIAL_QUERY_LENGTH = 2;

/**
 * Partial match: "digital" matches "Digital Skills" and "Digital Technology".
 * Exact matches still work. Reverse contains only when the catalog token is long enough.
 */
export function matchesSearchToken(haystack: readonly string[], needle: string): boolean {
  const normalizedNeedle = normalizeSearchToken(needle);
  if (normalizedNeedle.length < MIN_PARTIAL_QUERY_LENGTH) {
    return false;
  }
  return haystack.some((item) => {
    const normalizedItem = normalizeSearchToken(item);
    if (normalizedItem === normalizedNeedle) {
      return true;
    }
    if (normalizedItem.includes(normalizedNeedle)) {
      return true;
    }
    return (
      normalizedItem.length >= MIN_PARTIAL_QUERY_LENGTH && normalizedNeedle.includes(normalizedItem)
    );
  });
}

/** Keep catalog values and free-text queries long enough for partial matching. */
export function resolveSearchFilterValues(
  selected: readonly string[],
  catalog: readonly string[],
): string[] {
  return uniqueSortedStrings(
    selected.filter((value) => {
      const normalized = normalizeSearchToken(value);
      if (normalized.length < MIN_PARTIAL_QUERY_LENGTH) {
        return false;
      }
      if (includesNormalized(catalog, value)) {
        return true;
      }
      // Free-text / creatable partial query
      return true;
    }),
  );
}

/** @deprecated Prefer resolveSearchFilterValues for partial/creatable queries. */
export function filterToKnownCatalogValues(
  selected: readonly string[],
  catalog: readonly string[],
): string[] {
  return uniqueSortedStrings(selected.filter((value) => includesNormalized(catalog, value)));
}
