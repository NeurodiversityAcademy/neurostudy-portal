export type SearchParams = { [key: string]: string | string[] | undefined };

/**
 * Check whether a feature toggle is enabled via search params.
 *
 * By default it only treats the string 'true' as enabled. You can pass
 * an options.trueValues array to accept additional values (e.g. ['1']).
 */
export function isFeatureEnabled(
  searchParams: SearchParams | undefined,
  key: string,
  options?: { trueValues?: string[] }
): boolean {
  if (!key) return false;
  const raw = searchParams?.[key];
  const val = Array.isArray(raw) ? raw[0] : raw;
  if (val == null) return false;
  const trueValues = options?.trueValues ?? ['true'];
  // compare case-insensitively
  const cmp = String(val).toLowerCase();
  return trueValues.map((v) => v.toLowerCase()).includes(cmp);
}

export default isFeatureEnabled;
