/**
 * Fisher–Yates shuffle. Returns a new array; does not mutate the input.
 * Use only on the client after mount (Math.random) so SSR stays deterministic.
 */
export const shuffleInstitutions = <T>(items: readonly T[]): T[] => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = copy[i];
    copy[i] = copy[j] as T;
    copy[j] = current as T;
  }
  return copy;
};
