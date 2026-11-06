import { buildAssistCacheKey, createTtlCache, normalizeAssistCacheText } from './cache';

export type AssistRaw = {
  area: string | null;
  location: string | null;
};

/** Search intent is stable for a day; a model or prompt change rolls the cache. */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_MAX_ENTRIES = 500;

const responseCache = createTtlCache<AssistRaw>({
  maxEntries: CACHE_MAX_ENTRIES,
  ttlMs: CACHE_TTL_MS,
});

/** Coalesces concurrent identical requests so one query makes one model call. */
const inFlight = new Map<string, Promise<AssistRaw | null>>();

function cacheEnabled(): boolean {
  return process.env.ASSIST_CACHE !== 'off';
}

function cacheKey(model: string, system: string, userMessage: string): string {
  return buildAssistCacheKey([
    model,
    normalizeAssistCacheText(system),
    normalizeAssistCacheText(userMessage),
  ]);
}

/** Test helper — clears cached responses and in-flight requests. */
export function resetAssistModelCacheForTests(): void {
  responseCache.clear();
  inFlight.clear();
}

function extractJson(text: string | null | undefined): AssistRaw | null {
  if (!text) {
    return null;
  }

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  const snippet = text.slice(start, end + 1);
  try {
    const parsed = JSON.parse(snippet) as Partial<AssistRaw>;
    if (typeof parsed.area !== 'string' && parsed.area !== null) {
      return null;
    }
    if (typeof parsed.location !== 'string' && parsed.location !== null) {
      return null;
    }
    return {
      area: parsed.area ?? null,
      location: parsed.location ?? null,
    };
  } catch {
    return null;
  }
}

async function requestModel(
  apiUrl: string,
  apiKey: string,
  model: string,
  userMessage: string,
  system: string,
): Promise<AssistRaw | null> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (process.env.ASSIST_AUTH_HEADER === 'api-key') {
    headers['api-key'] = apiKey;
  } else {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7_000);

  const tokenParam = process.env.ASSIST_MAX_TOKENS_PARAM ?? 'max_completion_tokens';
  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userMessage },
    ],
    [tokenParam]: 80,
    ...(process.env.ASSIST_JSON_MODE === 'off' ? {} : { response_format: { type: 'json_object' } }),
  };

  if (process.env.ASSIST_TEMPERATURE) {
    body.temperature = Number(process.env.ASSIST_TEMPERATURE);
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return extractJson(data?.choices?.[0]?.message?.content);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function callModel(userMessage: string, system: string): Promise<AssistRaw | null> {
  const apiUrl = process.env.ASSIST_API_URL;
  const apiKey = process.env.ASSIST_API_KEY;
  const model = process.env.ASSIST_MODEL;
  if (!apiUrl || !apiKey || !model) {
    return null;
  }

  if (!cacheEnabled()) {
    return requestModel(apiUrl, apiKey, model, userMessage, system);
  }

  const key = cacheKey(model, system, userMessage);
  const cached = responseCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const pending = inFlight.get(key);
  if (pending) {
    return pending;
  }

  const request = requestModel(apiUrl, apiKey, model, userMessage, system)
    .then((result) => {
      // Only cache a parsed answer (including explicit nulls). Transient model
      // failures and malformed output stay uncached so the next request retries.
      if (result !== null) {
        responseCache.set(key, result);
      }
      return result;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, request);
  return request;
}
