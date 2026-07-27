/**
 * Fisher–Yates shuffle. Returns a new array; does not mutate the input.
 * Call only after mount (e.g. inside requestAnimationFrame) — Math.random must
 * not run during SSR or in useState initializers, or server HTML will not match
 * the first client paint.
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
