/** Last path segment of a destination URL, decoded — used for GA `file_name` on institution CTAs. */
export function analyticsFileNameFromUrl(url?: string | null): string {
  const safeUrl = typeof url === 'string' ? url : '';
  const last = safeUrl.split('/').pop() ?? '';
  let name = last;
  try {
    name = decodeURIComponent(last);
  } catch {
    // keep raw segment if decode fails
  }
  name = name.replace(/\+/g, ' ').trim();
  return name.length > 0 ? name : safeUrl;
}
