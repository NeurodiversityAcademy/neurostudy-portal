/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('@/app/utilities/api/rateLimiter', () => ({
  consumeRateWithIp: jest.fn(),
}));

jest.mock('botid/server', () => ({
  checkBotId: jest.fn(),
}));

jest.mock('@/app/utilities/providerSearch/catalog', () => ({
  loadProviderSearchContext: jest.fn(() => ({
    providers: [],
    locationCatalog: [],
    interestAreaCatalog: [],
  })),
}));

jest.mock('@/app/utilities/providerSearch/assist/parse', () => ({
  tryKeywordHit: jest.fn(),
  tryAreaOnlyHit: jest.fn(() => null),
  tryLocationOnlyHit: jest.fn(() => null),
  classifyOutOfScope: jest.fn(() => null),
  isOutOfScope: jest.fn(() => false),
  suggestAreas: jest.fn(() => []),
  detectInText: jest.fn(() => []),
  findUnmatchedTerms: jest.fn(() => []),
  resolveCatalogArea: jest.fn((area: string | null | undefined) =>
    typeof area === 'string' && area.trim().length > 0 ? area.trim() : null,
  ),
}));

jest.mock('@/app/utilities/providerSearch/assist/llm', () => ({
  callModel: jest.fn(),
  callModelWithMeta: jest.fn(),
}));

jest.mock('@/app/utilities/providerSearch/assist/prompt', () => ({
  buildAssistSystemPrompt: jest.fn(() => 'system'),
  buildUserMessage: jest.fn((text: string) => text),
}));

import APIError from '@/app/interfaces/APIError';
import { checkBotId } from 'botid/server';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { callModelWithMeta } from '@/app/utilities/providerSearch/assist/llm';
import {
  classifyOutOfScope,
  detectInText,
  findUnmatchedTerms,
  suggestAreas,
  tryAreaOnlyHit,
  tryKeywordHit,
  tryLocationOnlyHit,
} from '@/app/utilities/providerSearch/assist/parse';
import { POST } from '@/app/api/search/assist/route';

function modelCall(
  value: { area: string | null; location: string | null; unmatched?: string[] } | null,
) {
  return {
    value,
    meta: {
      model: 'test-model',
      latencyMs: 12,
      outcome: value ? ('ok' as const) : ('malformed' as const),
      cacheHit: false,
      usage: { prompt: 100, completion: 20, total: 120 },
    },
  };
}

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function makeRequest(
  body: unknown,
  options: { userAgent?: string | null; secFetchSite?: string; rawBody?: string } = {},
): NextRequest {
  const headers: Record<string, string> = {};
  if (options.userAgent !== null) {
    headers['user-agent'] = options.userAgent ?? BROWSER_UA;
  }
  if (options.secFetchSite) {
    headers['sec-fetch-site'] = options.secFetchSite;
  }

  return new NextRequest(new URL('http://localhost:3000/api/search/assist'), {
    method: 'POST',
    headers,
    body: options.rawBody ?? JSON.stringify(body),
  });
}

describe('POST /api/search/assist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(consumeRateWithIp).mockResolvedValue({ ip: '127.0.0.1', data: {} });
    jest.mocked(checkBotId).mockResolvedValue({
      isHuman: true,
      isBot: false,
      isVerifiedBot: false,
      bypassed: false,
    });
    jest.mocked(tryKeywordHit).mockReturnValue(null);
    jest.mocked(tryAreaOnlyHit).mockReturnValue(null);
    jest.mocked(tryLocationOnlyHit).mockReturnValue(null);
    jest.mocked(classifyOutOfScope).mockReturnValue(null);
    jest.mocked(findUnmatchedTerms).mockReturnValue([]);
    jest.mocked(callModelWithMeta).mockResolvedValue(modelCall(null));
  });

  it('refuses declared AI crawlers before doing any work', async () => {
    const response = await POST(
      makeRequest({ text: 'nursing in melbourne' }, { userAgent: 'GPTBot/1.2' }),
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      error: 'Search is available to people using this site.',
    });
    expect(consumeRateWithIp).not.toHaveBeenCalled();
    expect(callModelWithMeta).not.toHaveBeenCalled();
  });

  it('refuses scripted clients', async () => {
    const response = await POST(
      makeRequest({ text: 'nursing in melbourne' }, { userAgent: 'curl/8.7.1' }),
    );

    expect(response.status).toBe(403);
    expect(callModelWithMeta).not.toHaveBeenCalled();
  });

  it('refuses requests without a user agent', async () => {
    const response = await POST(makeRequest({ text: 'nursing in melbourne' }, { userAgent: null }));

    expect(response.status).toBe(403);
  });

  it('refuses cross-site requests', async () => {
    const response = await POST(
      makeRequest({ text: 'nursing in melbourne' }, { secFetchSite: 'cross-site' }),
    );

    expect(response.status).toBe(403);
  });

  it('refuses requests BotID classifies as bots', async () => {
    jest.mocked(checkBotId).mockResolvedValueOnce({
      isHuman: false,
      isBot: true,
      isVerifiedBot: false,
      bypassed: false,
    });

    const response = await POST(makeRequest({ text: 'nursing in melbourne' }));

    expect(response.status).toBe(403);
  });

  it('continues when BotID is unavailable', async () => {
    jest.mocked(checkBotId).mockRejectedValueOnce(new Error('unavailable'));
    jest.mocked(tryKeywordHit).mockReturnValue({ area: 'Nursing', locations: ['VIC'] });

    const response = await POST(makeRequest({ text: 'nursing in melbourne' }));

    expect(response.status).toBe(200);
  });

  it('answers a browser search without calling the model when a keyword hits', async () => {
    jest.mocked(tryKeywordHit).mockReturnValue({ area: 'Nursing', locations: ['VIC'] });

    const response = await POST(makeRequest({ text: 'nursing in melbourne' }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      area: 'Nursing',
      locations: ['VIC'],
      suggestions: [],
      usedModel: false,
    });
    expect(callModelWithMeta).not.toHaveBeenCalled();
  });

  it('returns 429 when the rate limiter rejects the request', async () => {
    jest
      .mocked(consumeRateWithIp)
      .mockRejectedValueOnce(new APIError({ status: 429, error: 'Too Many Requests.' }));

    const response = await POST(makeRequest({ text: 'nursing in melbourne' }));

    expect(response.status).toBe(429);
  });

  it('rejects queries that are too short or too long', async () => {
    const short = await POST(makeRequest({ text: 'ab' }));
    expect(short.status).toBe(400);

    const long = await POST(makeRequest({ text: 'a'.repeat(301) }));
    expect(long.status).toBe(400);
  });

  it('rejects malformed JSON bodies without a 500', async () => {
    const response = await POST(makeRequest({}, { rawBody: 'not-json' }));

    expect(response.status).toBe(400);
  });

  it('rejects non-string query text', async () => {
    const response = await POST(makeRequest({ text: 42 }));

    expect(response.status).toBe(400);
  });

  it('returns off-topic for advice or prompt-injection attempts', async () => {
    jest.mocked(classifyOutOfScope).mockReturnValueOnce('advice_no_slot');

    const response = await POST(makeRequest({ text: 'which university should i pick' }));

    expect(await response.json()).toEqual({ offTopic: true, suggestions: [], usedModel: false });
    expect(callModelWithMeta).not.toHaveBeenCalled();
  });

  it('uses the model result when the area and location resolve', async () => {
    jest
      .mocked(callModelWithMeta)
      .mockResolvedValueOnce(modelCall({ area: 'Nursing', location: 'VIC' }));
    jest.mocked(detectInText).mockReturnValueOnce(['VIC']);

    const response = await POST(makeRequest({ text: 'nursing near me' }));

    expect(await response.json()).toEqual({
      area: 'Nursing',
      locations: ['VIC'],
      suggestions: [],
      usedModel: true,
    });
  });

  it('drops model locations that are not in the catalog', async () => {
    jest
      .mocked(callModelWithMeta)
      .mockResolvedValueOnce(modelCall({ area: 'Nursing', location: 'Narnia' }));
    jest.mocked(detectInText).mockReturnValueOnce([]);

    const response = await POST(makeRequest({ text: 'nursing somewhere' }));

    expect(await response.json()).toEqual({
      area: 'Nursing',
      locations: [],
      suggestions: [],
      usedModel: true,
    });
  });

  it('falls back to area suggestions when the model finds no area', async () => {
    jest.mocked(callModelWithMeta).mockResolvedValueOnce(modelCall({ area: null, location: null }));
    jest.mocked(suggestAreas).mockReturnValueOnce(['Nursing']);

    const response = await POST(makeRequest({ text: 'nurs' }));

    expect(await response.json()).toEqual({
      area: null,
      locations: [],
      suggestions: ['Nursing'],
      usedModel: false,
    });
  });

  it('falls back to detected interest areas when there are no suggestions', async () => {
    jest.mocked(callModelWithMeta).mockResolvedValueOnce(modelCall(null));
    jest.mocked(suggestAreas).mockReturnValueOnce([]);
    jest.mocked(detectInText).mockReturnValueOnce(['Design']);

    const response = await POST(makeRequest({ text: 'design' }));

    expect(await response.json()).toEqual({
      area: null,
      locations: [],
      suggestions: ['Design'],
      usedModel: false,
    });
  });

  it('keeps a location-only answer so "study in melbourne" returns results', async () => {
    jest
      .mocked(callModelWithMeta)
      .mockResolvedValueOnce(modelCall({ area: null, location: 'Melbourne' }));
    jest.mocked(detectInText).mockReturnValueOnce(['Melbourne']);

    const response = await POST(makeRequest({ text: 'study in melbourne' }));

    expect(await response.json()).toEqual({
      area: null,
      locations: ['Melbourne'],
      suggestions: [],
      usedModel: true,
    });
  });

  it('reports unmatched words when neither an area nor a location was understood', async () => {
    jest.mocked(callModelWithMeta).mockResolvedValueOnce(modelCall(null));
    jest.mocked(suggestAreas).mockReturnValueOnce([]);
    jest.mocked(detectInText).mockReturnValueOnce([]);
    jest.mocked(findUnmatchedTerms).mockReturnValueOnce(['gibberish', 'gubberush']);

    const response = await POST(makeRequest({ text: 'gibberish in gubberush' }));

    expect(findUnmatchedTerms).toHaveBeenCalledWith(
      'gibberish in gubberush',
      null,
      [],
      expect.anything(),
    );
    expect(await response.json()).toEqual({
      area: null,
      locations: [],
      unmatched: ['gibberish', 'gubberush'],
      suggestions: [],
      usedModel: false,
    });
  });

  it('reports unmatched words even when no model call was possible', async () => {
    jest.mocked(callModelWithMeta).mockResolvedValueOnce(modelCall(null));
    jest.mocked(tryLocationOnlyHit).mockReturnValueOnce(['NSW', 'Sydney']);
    jest.mocked(findUnmatchedTerms).mockReturnValueOnce(['asdfgh']);

    const response = await POST(makeRequest({ text: 'asdfgh in nsw' }));

    expect(findUnmatchedTerms).toHaveBeenCalledWith(
      'asdfgh in nsw',
      null,
      ['NSW', 'Sydney'],
      expect.anything(),
    );
    expect(await response.json()).toEqual({
      area: null,
      locations: ['NSW', 'Sydney'],
      unmatched: ['asdfgh'],
      suggestions: [],
      usedModel: true,
    });
  });

  it('reports the words the model could not map instead of hiding them', async () => {
    jest
      .mocked(callModelWithMeta)
      .mockResolvedValueOnce(modelCall({ area: null, location: 'NSW', unmatched: ['asdfgh'] }));
    jest.mocked(detectInText).mockReturnValueOnce(['NSW']);

    const response = await POST(makeRequest({ text: 'asdfgh in nsw' }));

    expect(await response.json()).toEqual({
      area: null,
      locations: ['NSW'],
      unmatched: ['asdfgh'],
      suggestions: [],
      usedModel: true,
    });
  });

  it('keeps a model area with no location so results cover every location', async () => {
    jest
      .mocked(callModelWithMeta)
      .mockResolvedValueOnce(modelCall({ area: 'Business', location: null }));

    const response = await POST(makeRequest({ text: 'business' }));

    expect(await response.json()).toEqual({
      area: 'Business',
      locations: [],
      suggestions: [],
      usedModel: true,
    });
  });

  it('keeps an area-only answer so "nursing" searches every location', async () => {
    jest.mocked(callModelWithMeta).mockResolvedValueOnce(modelCall({ area: null, location: null }));
    jest.mocked(tryAreaOnlyHit).mockReturnValueOnce('Nursing');

    const response = await POST(makeRequest({ text: 'nursing' }));

    expect(await response.json()).toEqual({
      area: 'Nursing',
      locations: [],
      suggestions: [],
      usedModel: true,
    });
  });

  it('detects the location when the model returns nothing for a location-only query', async () => {
    jest.mocked(callModelWithMeta).mockResolvedValueOnce(modelCall({ area: null, location: null }));
    jest.mocked(tryLocationOnlyHit).mockReturnValueOnce(['Melbourne', 'VIC']);

    const response = await POST(makeRequest({ text: 'study in melbourne' }));

    expect(await response.json()).toEqual({
      area: null,
      locations: ['Melbourne', 'VIC'],
      suggestions: [],
      usedModel: true,
    });
  });
});
