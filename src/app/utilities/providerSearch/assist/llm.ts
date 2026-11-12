import { buildAssistCacheKey, createTtlCache, normalizeAssistCacheText } from './cache';

export type AssistRaw = {
  area: string | null;
  location: string | null;
  /** Words the model could not map; lets the results page explain a partial match. */
  unmatched?: string[];
};

const MAX_UNMATCHED_TERMS = 3;
const MAX_UNMATCHED_LENGTH = 40;

function readUnmatched(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((word): word is string => typeof word === 'string')
    .map((word) => word.trim())
    .filter((word) => word.length > 0 && word.length <= MAX_UNMATCHED_LENGTH)
    .slice(0, MAX_UNMATCHED_TERMS);
}

export type AssistModelOutcome =
  'ok' | 'no_match' | 'malformed' | 'http_error' | 'timeout' | 'error' | 'unconfigured';

export type AssistTokenUsage = {
  prompt: number | null;
  completion: number | null;
  total: number | null;
};

export type AssistModelMeta = {
  model: string;
  latencyMs: number;
  outcome: AssistModelOutcome;
  cacheHit: boolean;
  usage: AssistTokenUsage;
  /** Model output as received, capped so a malformed answer stays diagnosable. */
  rawResponse?: string | null;
};

export type AssistModelCall = {
  value: AssistRaw | null;
  meta: AssistModelMeta;
};

type CachedAssist = {
  value: AssistRaw;
  outcome: 'ok' | 'no_match';
  usage: AssistTokenUsage;
  rawResponse?: string | null;
};

/** Longest model output kept in telemetry; the schema allows ~80 tokens. */
const MAX_RAW_RESPONSE_CHARS = 400;

const EMPTY_USAGE: AssistTokenUsage = { prompt: null, completion: null, total: null };

/** Search intent is stable for a day; a model or prompt change rolls the cache. */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_MAX_ENTRIES = 500;

const responseCache = createTtlCache<CachedAssist>({
  maxEntries: CACHE_MAX_ENTRIES,
  ttlMs: CACHE_TTL_MS,
});

/** Coalesces concurrent identical requests so one query makes one model call. */
const inFlight = new Map<string, Promise<AssistModelCall>>();

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
    const unmatched = readUnmatched((parsed as { unmatched?: unknown }).unmatched);
    return {
      area: parsed.area ?? null,
      location: parsed.location ?? null,
      ...(unmatched.length > 0 ? { unmatched } : {}),
    };
  } catch {
    return null;
  }
}

function tokenCount(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return Math.round(value);
}

function readUsage(data: {
  usage?: {
    prompt_tokens?: unknown;
    completion_tokens?: unknown;
    total_tokens?: unknown;
    input_tokens?: unknown;
    output_tokens?: unknown;
  };
}): AssistTokenUsage {
  const usage = data.usage;
  if (!usage) {
    return { ...EMPTY_USAGE };
  }
  return {
    prompt: tokenCount(usage.prompt_tokens ?? usage.input_tokens),
    completion: tokenCount(usage.completion_tokens ?? usage.output_tokens),
    total: tokenCount(usage.total_tokens),
  };
}

function outcomeFor(value: AssistRaw | null): AssistModelOutcome {
  if (value === null) {
    return 'malformed';
  }
  if (value.area === null && value.location === null) {
    return 'no_match';
  }
  return 'ok';
}

async function requestModel(
  apiUrl: string,
  apiKey: string,
  model: string,
  userMessage: string,
  system: string,
): Promise<AssistModelCall> {
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
  const startedAt = Date.now();

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
      return {
        value: null,
        meta: {
          model,
          latencyMs: Date.now() - startedAt,
          outcome: 'http_error',
          cacheHit: false,
          usage: { ...EMPTY_USAGE },
          rawResponse: null,
        },
      };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: {
        prompt_tokens?: unknown;
        completion_tokens?: unknown;
        total_tokens?: unknown;
        input_tokens?: unknown;
        output_tokens?: unknown;
      };
    };

    const raw = data?.choices?.[0]?.message?.content ?? null;
    const value = extractJson(raw);
    return {
      value,
      meta: {
        model,
        latencyMs: Date.now() - startedAt,
        outcome: outcomeFor(value),
        cacheHit: false,
        usage: readUsage(data),
        rawResponse: raw === null ? null : raw.slice(0, MAX_RAW_RESPONSE_CHARS),
      },
    };
  } catch {
    return {
      value: null,
      meta: {
        model,
        latencyMs: Date.now() - startedAt,
        outcome: controller.signal.aborted ? 'timeout' : 'error',
        cacheHit: false,
        usage: { ...EMPTY_USAGE },
        rawResponse: null,
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Calls the model and returns token/latency metadata alongside the parsed
 * intent. `callModel` remains the value-only convenience wrapper.
 */
export async function callModelWithMeta(
  userMessage: string,
  system: string,
): Promise<AssistModelCall> {
  const apiUrl = process.env.ASSIST_API_URL;
  const apiKey = process.env.ASSIST_API_KEY;
  const model = process.env.ASSIST_MODEL;
  if (!apiUrl || !apiKey || !model) {
    return {
      value: null,
      meta: {
        model: model ?? '',
        latencyMs: 0,
        outcome: 'unconfigured',
        cacheHit: false,
        usage: { ...EMPTY_USAGE },
        rawResponse: null,
      },
    };
  }

  if (!cacheEnabled()) {
    return requestModel(apiUrl, apiKey, model, userMessage, system);
  }

  const key = cacheKey(model, system, userMessage);
  const cached = responseCache.get(key);
  if (cached !== undefined) {
    return {
      value: cached.value,
      meta: {
        model,
        latencyMs: 0,
        outcome: cached.outcome,
        cacheHit: true,
        usage: cached.usage,
        rawResponse: cached.rawResponse ?? null,
      },
    };
  }

  const pending = inFlight.get(key);
  if (pending) {
    return pending;
  }

  const request = requestModel(apiUrl, apiKey, model, userMessage, system)
    .then((result) => {
      // Only cache a parsed answer (including explicit nulls). Transient model
      // failures and malformed output stay uncached so the next request retries.
      if (result.value !== null) {
        responseCache.set(key, {
          value: result.value,
          outcome: result.meta.outcome === 'no_match' ? 'no_match' : 'ok',
          usage: result.meta.usage,
          rawResponse: result.meta.rawResponse ?? null,
        });
      }
      return result;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, request);
  return request;
}

export async function callModel(userMessage: string, system: string): Promise<AssistRaw | null> {
  return (await callModelWithMeta(userMessage, system)).value;
}
