export type AssistSearchResponse = {
  area?: string | null;
  locations?: string[];
  offTopic?: boolean;
  suggestions?: string[];
  /** Words the assist could not map; the results page explains them. */
  unmatched?: string[];
  traceId?: string;
};

/**
 * Ask the search assist endpoint.
 *
 * Returns null when the endpoint refuses the request (including for automation)
 * or the network fails, so callers fall back to the existing filter search.
 */
export async function requestAssistSearch(text: string): Promise<AssistSearchResponse | null> {
  try {
    const response = await fetch('/api/search/assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      return null;
    }

    return {
      ...((await response.json()) as AssistSearchResponse),
      traceId: response.headers?.get?.('x-nda-trace-id') ?? undefined,
    };
  } catch {
    return null;
  }
}
