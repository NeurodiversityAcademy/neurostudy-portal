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
  suggestAreas,
  tryKeywordHit,
} from '@/app/utilities/providerSearch/assist/parse';
import {
  buildAssistSystemPrompt,
  buildUserMessage,
} from '@/app/utilities/providerSearch/assist/prompt';
import { observeApi, type ApiTrace } from '@/app/utilities/observability/apiTrace';
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

function normaliseArea(area: string | null | undefined): string | null {
  if (typeof area !== 'string') {
    return null;
  }
  const trimmed = area.trim();
  return trimmed.length > 0 ? trimmed : null;
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
  area: string,
  locations: string[],
): {
  resultCount: number;
  tierCounts: { courseEndorsed: number; endorsed: number; emerging: number };
} {
  const results = searchProvidersByFilters(context.providers, {
    interestAreas: [area],
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

/** Kept separate so every return path can be traced with one outcome. */
async function handlePost(request: NextRequest, trace: ApiTrace): Promise<Response> {
  try {
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

    const context = loadProviderSearchContext();
    const keywordHit = tryKeywordHit(text, context);
    if (keywordHit) {
      trace.setDecision({
        path: 'keyword',
        area: keywordHit.area,
        locations: keywordHit.locations,
        ...resultCounts(context, keywordHit.area, keywordHit.locations),
      });
      trace.setUsage({ usedModel: false, tokens: { ...ZERO_TOKENS } });
      trace.setOutcome('keyword_hit', 'keyword_match');
      return Response.json({
        area: keywordHit.area,
        locations: keywordHit.locations,
        suggestions: [],
        usedModel: false,
      });
    }

    const offTopicReason = classifyOutOfScope(text, context);
    if (offTopicReason) {
      trace.setDecision({ path: 'off_topic' });
      trace.setOutcome('off_topic', offTopicReason);
      return Response.json({ offTopic: true, suggestions: [], usedModel: false });
    }

    const modelCall = await callModelWithMeta(buildUserMessage(text), buildAssistSystemPrompt());
    const measuredTokens = {
      prompt: modelCall.meta.usage.prompt,
      completion: modelCall.meta.usage.completion,
      total: modelCall.meta.usage.total,
    };
    trace.setUsage({
      usedModel: true,
      model: modelCall.meta.model,
      cacheHit: modelCall.meta.cacheHit,
      tokens: modelCall.meta.cacheHit ? { ...ZERO_TOKENS } : measuredTokens,
      tokensSaved: modelCall.meta.cacheHit ? measuredTokens : undefined,
    });

    const area = normaliseArea(modelCall.value?.area);
    if (area) {
      const locationCandidates = normaliseLocation(modelCall.value?.location);
      const locations = locationCandidates.filter(
        (value) => detectInText(value, context.locationCatalog).length > 0,
      );
      trace.setDecision({
        path: 'model',
        area,
        locations,
        ...resultCounts(context, area, locations),
      });
      trace.setOutcome('model_hit', 'model_area');
      return Response.json({
        area,
        locations,
        suggestions: [],
        usedModel: true,
      });
    }

    const suggestions = suggestAreas(text, context);
    const fallbackSuggestions =
      suggestions.length > 0 ? suggestions : detectInText(text, context.interestAreaCatalog);
    trace.setDecision({ path: 'suggestion', area: null, locations: [] });
    trace.setOutcome(
      'suggestion',
      modelCall.meta.outcome === 'no_match' ? 'model_no_match' : `model_${modelCall.meta.outcome}`,
    );
    return Response.json({
      area: null,
      locations: [],
      suggestions: fallbackSuggestions,
      usedModel: false,
    });
  } catch (error) {
    trace.setOutcome('error', 'unhandled_route_error');
    return processAPIError(error instanceof Error ? error : null);
  }
}

export async function POST(request: NextRequest) {
  return observeApi('search/assist', request, (trace) => handlePost(request, trace));
}
