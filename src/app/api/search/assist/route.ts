import { NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import processAPIError from '@/app/utilities/api/processAPIError';
import { isAutomationUserAgent, isCrossSiteRequest } from '@/app/utilities/api/automationGuard';
import { loadProviderSearchContext } from '@/app/utilities/providerSearch/catalog';
import { callModel } from '@/app/utilities/providerSearch/assist/llm';
import {
  detectInText,
  isOutOfScope,
  suggestAreas,
  tryKeywordHit,
} from '@/app/utilities/providerSearch/assist/parse';
import {
  buildAssistSystemPrompt,
  buildUserMessage,
} from '@/app/utilities/providerSearch/assist/prompt';

export const dynamic = 'force-dynamic';

/** Search queries are short; anything longer is not a person asking a question. */
const MAX_QUERY_LENGTH = 300;

const SEARCH_IS_FOR_PEOPLE = 'Search is available to people using this site.';

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

export async function POST(request: NextRequest) {
  try {
    const automationResponse = rejectAutomation(request);
    if (automationResponse) {
      return automationResponse;
    }

    await consumeRateWithIp(request);

    try {
      const verification = await checkBotId({
        // Ignored in production; lets search work in local development.
        developmentOptions: { bypass: 'HUMAN' },
      });
      if (verification.isBot || verification.isVerifiedBot) {
        return Response.json({ error: SEARCH_IS_FOR_PEOPLE }, { status: 403 });
      }
    } catch {
      // BotID unavailable: the user-agent guard and rate limit above still apply.
    }

    let body: { text?: unknown };
    try {
      body = (await request.json()) as { text?: unknown };
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const text = typeof body.text === 'string' ? body.text.trim() : '';

    if (text.length < 3) {
      return Response.json({ error: 'Query too short' }, { status: 400 });
    }

    if (text.length > MAX_QUERY_LENGTH) {
      return Response.json({ error: 'Query too long' }, { status: 400 });
    }

    const context = loadProviderSearchContext();
    const keywordHit = tryKeywordHit(text, context);
    if (keywordHit) {
      return Response.json({
        area: keywordHit.area,
        locations: keywordHit.locations,
        suggestions: [],
        usedModel: false,
      });
    }

    if (isOutOfScope(text)) {
      return Response.json({ offTopic: true, suggestions: [], usedModel: false });
    }

    const modelResult = await callModel(buildUserMessage(text), buildAssistSystemPrompt());
    const area = normaliseArea(modelResult?.area);
    if (area) {
      const locationCandidates = normaliseLocation(modelResult?.location);
      const locations = locationCandidates.filter(
        (value) => detectInText(value, context.locationCatalog).length > 0,
      );
      return Response.json({
        area,
        locations,
        suggestions: [],
        usedModel: true,
      });
    }

    const suggestions = suggestAreas(text, context);
    return Response.json({
      area: null,
      locations: [],
      suggestions:
        suggestions.length > 0 ? suggestions : detectInText(text, context.interestAreaCatalog),
      usedModel: false,
    });
  } catch (error) {
    return processAPIError(error instanceof Error ? error : null);
  }
}
