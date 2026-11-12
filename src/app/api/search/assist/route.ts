import { NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import processAPIError from '@/app/utilities/api/processAPIError';
import { isAutomationUserAgent, isCrossSiteRequest } from '@/app/utilities/api/automationGuard';
import {
  loadProviderSearchContext,
  type ProviderSearchContext,
} from '@/app/utilities/providerSearch/catalog';
import { callModelWithMeta } from '@/app/utilities/providerSearch/assist/llm';
import {
  classifyOutOfScope,
  detectInText,
  findUnmatchedTerms,
  resolveCatalogArea,
  suggestAreas,
  tryAreaOnlyHit,
  tryKeywordHit,
  tryLocationOnlyHit,
} from '@/app/utilities/providerSearch/assist/parse';
import {
  buildAssistSystemPrompt,
  buildUserMessage,
} from '@/app/utilities/providerSearch/assist/prompt';
import { observeApi, type ApiTrace } from '@/app/utilities/observability/apiTrace';
import { hashQuery } from '@/app/utilities/observability/events';
import {
  countProviderSearchResults,
  searchProvidersByFilters,
} from '@/app/utilities/providerSearch/searchProviders';

export const dynamic = 'force-dynamic';

/** Search queries are short; anything longer is not a person asking a question. */
const MAX_QUERY_LENGTH = 300;

const SEARCH_IS_FOR_PEOPLE = 'Search is available to people using this site.';

const SURFACES = new Set(['homepage', 'search']);
const MODES = new Set(['quick', 'ask']);

const ZERO_TOKENS = { prompt: 0, completion: 0, total: 0 } as const;

type AssistBody = {
  text?: unknown;
  surface?: unknown;
  mode?: unknown;
};

type KeywordHit = { area: string; locations: string[] };

/** Assist calls cost a model request, so automation is refused before any work. */
function rejectAutomation(request: Request): Response | null {
  if (
    isCrossSiteRequest(request.headers) ||
    isAutomationUserAgent(request.headers.get('user-agent'))
  ) {
    return Response.json({ error: SEARCH_IS_FOR_PEOPLE }, { status: 403 });
  }

  return null;
}

function normaliseArea(
  area: string | null | undefined,
  context: ProviderSearchContext,
): string | null {
  if (typeof area !== 'string') {
    return null;
  }
  const trimmed = area.trim();
  // A model label that is not in the catalog would search for providers that
  // cannot exist, so map it onto a real area or drop it.
  return trimmed.length > 0 ? resolveCatalogArea(trimmed, context) : null;
}

function normaliseUnmatched(value: string[] | undefined): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((word): word is string => typeof word === 'string')
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
    .slice(0, 3);
}

function normaliseLocation(location: string | null | undefined): string[] {
  if (typeof location !== 'string') {
    return [];
  }
  const trimmed = location.trim();
  return trimmed.length > 0 ? [trimmed] : [];
}

function parseSurface(value: unknown): 'homepage' | 'search' {
  return typeof value === 'string' && SURFACES.has(value)
    ? (value as 'homepage' | 'search')
    : 'search';
}

function parseMode(value: unknown): 'quick' | 'ask' {
  return typeof value === 'string' && MODES.has(value) ? (value as 'quick' | 'ask') : 'quick';
}

function resultCounts(
  context: ProviderSearchContext,
  area: string | null,
  locations: string[],
): {
  resultCount: number;
  tierCounts: { courseEndorsed: number; endorsed: number; emerging: number };
} {
  const results = searchProvidersByFilters(context.providers, {
    interestAreas: area ? [area] : [],
    locations,
  });
  return {
    resultCount: countProviderSearchResults(results),
    tierCounts: {
      courseEndorsed: results.course_endorsed.length,
      endorsed: results.endorsed.length,
      emerging: results.emerging.length,
    },
  };
}

/** Cheap guards first: each one is traced with the gate it came from. */
async function enforceGates(request: NextRequest, trace: ApiTrace): Promise<Response | null> {
  const automation = rejectAutomation(request);
  if (automation) {
    trace.setGate({ automation: 'blocked' });
    trace.setOutcome('forbidden', 'automation');
    return automation;
  }
  trace.setGate({ automation: 'pass' });

  try {
    await consumeRateWithIp(request);
    trace.setGate({ rateLimit: 'pass' });
  } catch (error) {
    trace.setGate({ rateLimit: 'blocked' });
    trace.setOutcome('rate_limited', 'rate_limit');
    return processAPIError(error instanceof Error ? error : null);
  }

  try {
    const verification = await checkBotId({
      // Ignored in production; lets search work in local development.
      developmentOptions: { bypass: 'HUMAN' },
    });
    if (verification.isBot || verification.isVerifiedBot) {
      trace.setGate({ botId: 'blocked' });
      trace.setOutcome('forbidden', 'bot');
      return Response.json({ error: SEARCH_IS_FOR_PEOPLE }, { status: 403 });
    }
    trace.setGate({ botId: 'pass' });
  } catch {
    // BotID unavailable: the user-agent guard and rate limit above still apply.
    trace.setGate({ botId: 'unavailable' });
  }

  return null;
}

/** Returns the query text, or the error response for an unusable body. */
async function readAssistQuery(request: NextRequest, trace: ApiTrace): Promise<string | Response> {
  let body: AssistBody;
  try {
    body = (await request.json()) as AssistBody;
  } catch {
    trace.setOutcome('invalid_request', 'malformed_json');
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  trace.setUsage({ surface: parseSurface(body.surface), mode: parseMode(body.mode) });

  if (text.length < 3) {
    trace.setOutcome('invalid_request', 'query_too_short');
    return Response.json({ error: 'Query too short' }, { status: 400 });
  }

  if (text.length > MAX_QUERY_LENGTH) {
    trace.setOutcome('invalid_request', 'query_too_long');
    return Response.json({ error: 'Query too long' }, { status: 400 });
  }

  trace.setQuery(text);
  return text;
}

function respondKeywordHit(
  hit: KeywordHit,
  context: ProviderSearchContext,
  trace: ApiTrace,
): Response {
  trace.setDecision({
    path: 'keyword',
    area: hit.area,
    locations: hit.locations,
    ...resultCounts(context, hit.area, hit.locations),
  });
  trace.setUsage({ usedModel: false, tokens: { ...ZERO_TOKENS } });
  trace.setOutcome('keyword_hit', 'keyword_match');
  return Response.json({
    area: hit.area,
    locations: hit.locations,
    suggestions: [],
    usedModel: false,
  });
}

function respondOffTopic(reason: string, trace: ApiTrace): Response {
  trace.setDecision({ path: 'off_topic' });
  trace.setOutcome('off_topic', reason);
  return Response.json({ offTopic: true, suggestions: [], usedModel: false });
}

async function respondFromModel(
  text: string,
  context: ProviderSearchContext,
  trace: ApiTrace,
): Promise<Response> {
  // The prompt is deterministic for a given catalog, so the trace stores its
  // fingerprint instead of repeating ~2k characters on every request.
  const systemPrompt = buildAssistSystemPrompt(context);
  const modelCall = await callModelWithMeta(buildUserMessage(text), systemPrompt);
  const measuredTokens = {
    prompt: modelCall.meta.usage.prompt,
    completion: modelCall.meta.usage.completion,
    total: modelCall.meta.usage.total,
  };
  trace.setUsage({
    usedModel: true,
    model: modelCall.meta.model,
    cacheHit: modelCall.meta.cacheHit,
    modelResponse: modelCall.meta.rawResponse ?? undefined,
    promptChars: systemPrompt.length,
    promptHash: hashQuery(systemPrompt),
    tokens: modelCall.meta.cacheHit ? { ...ZERO_TOKENS } : measuredTokens,
    tokensSaved: modelCall.meta.cacheHit ? measuredTokens : undefined,
  });

  const modelLocations = normaliseLocation(modelCall.value?.location).filter(
    (value) => detectInText(value, context.locationCatalog).length > 0,
  );
  // Location-only ("study in melbourne") and area-only ("nursing") queries are
  // real searches: keep whichever side we found, so a bare area returns results
  // across every location instead of a suggestions-only response.
  const area = normaliseArea(modelCall.value?.area, context) ?? tryAreaOnlyHit(text, context);
  const locations =
    modelLocations.length > 0 ? modelLocations : (tryLocationOnlyHit(text, context) ?? []);

  if (area || locations.length > 0) {
    // The model knows which words it dropped; without a model call, work out
    // which ones the catalog cannot explain.
    const unmatched =
      modelCall.value === null
        ? findUnmatchedTerms(text, area, locations, context)
        : normaliseUnmatched(modelCall.value.unmatched);
    trace.setDecision({
      path: 'model',
      area,
      locations,
      unmatched,
      ...resultCounts(context, area, locations),
    });
    trace.setOutcome('model_hit', area ? 'model_area' : 'model_location');
    return Response.json({
      area,
      locations,
      ...(unmatched.length > 0 ? { unmatched } : {}),
      suggestions: [],
      usedModel: true,
    });
  }

  const suggestions = suggestAreas(text, context);
  const fallbackSuggestions =
    suggestions.length > 0 ? suggestions : detectInText(text, context.interestAreaCatalog);
  // Nothing was understood: the dropped words still deserve an explanation.
  const unmatchedNothing =
    modelCall.value === null
      ? findUnmatchedTerms(text, null, [], context)
      : normaliseUnmatched(modelCall.value.unmatched);
  trace.setDecision({
    path: 'suggestion',
    area: null,
    locations: [],
    unmatched: unmatchedNothing,
  });
  trace.setOutcome(
    'suggestion',
    modelCall.meta.outcome === 'no_match' ? 'model_no_match' : `model_${modelCall.meta.outcome}`,
  );
  return Response.json({
    area: null,
    locations: [],
    ...(unmatchedNothing.length > 0 ? { unmatched: unmatchedNothing } : {}),
    suggestions: fallbackSuggestions,
    usedModel: false,
  });
}

/** Kept separate so every return path can be traced with one outcome. */
async function handlePost(request: NextRequest, trace: ApiTrace): Promise<Response> {
  try {
    const blocked = await enforceGates(request, trace);
    if (blocked) {
      return blocked;
    }

    const query = await readAssistQuery(request, trace);
    if (query instanceof Response) {
      return query;
    }

    const context = loadProviderSearchContext();
    const keywordHit = tryKeywordHit(query, context);
    if (keywordHit) {
      return respondKeywordHit(keywordHit, context, trace);
    }

    const offTopicReason = classifyOutOfScope(query, context);
    if (offTopicReason) {
      return respondOffTopic(offTopicReason, trace);
    }

    return await respondFromModel(query, context, trace);
  } catch (error) {
    trace.setOutcome('error', 'unhandled_route_error');
    return processAPIError(error instanceof Error ? error : null);
  }
}

export async function POST(request: NextRequest) {
  return observeApi('search/assist', request, (trace) => handlePost(request, trace));
}
