/**
 * Copy for a search that was only partly understood. Lives next to the search
 * filters rather than above the results so it reads as feedback on the query.
 */
export function buildUnmatchedMessage(
  words: readonly string[],
  locations: readonly string[],
): string | null {
  if (words.length === 0) {
    return null;
  }

  const quoted = words.map((word) => `“${word}”`).join(', ');
  // A city expands to its state, so "NSW, Sydney" reads better as just "NSW".
  const state = locations.find((location) => /^[A-Z]{2,3}$/.test(location));
  const scope = state ? ` in ${state}` : locations.length > 0 ? ` in ${locations.join(', ')}` : '';

  return `We couldn't match ${quoted} to an area of study — showing all results${scope}.`;
}
