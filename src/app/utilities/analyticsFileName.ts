/** Last path segment of a PDF URL, decoded — used for GA `file_name` on institution CTAs. */
export function analyticsFileNameFromPdfUrl(pdfUrl: string): string {
  const last = pdfUrl.split('/').pop() ?? '';
  let name = last;
  try {
    name = decodeURIComponent(last);
  } catch {
    // keep raw segment if decode fails
  }
  name = name.replace(/\+/g, ' ').trim();
  return name.length > 0 ? name : pdfUrl;
}
