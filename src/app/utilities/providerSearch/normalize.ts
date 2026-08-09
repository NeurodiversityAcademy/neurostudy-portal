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

export function includesNormalized(haystack: readonly string[], needle: string): boolean {
  const normalizedNeedle = normalizeSearchToken(needle);
  return haystack.some((item) => normalizeSearchToken(item) === normalizedNeedle);
}

export function filterToKnownCatalogValues(
  selected: readonly string[],
  catalog: readonly string[],
): string[] {
  return uniqueSortedStrings(selected.filter((value) => includesNormalized(catalog, value)));
}
