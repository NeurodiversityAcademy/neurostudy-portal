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
  isOutOfScope: jest.fn(() => false),
  suggestAreas: jest.fn(() => []),
  detectInText: jest.fn(() => []),
}));

jest.mock('@/app/utilities/providerSearch/assist/llm', () => ({
  callModel: jest.fn(),
}));

jest.mock('@/app/utilities/providerSearch/assist/prompt', () => ({
  buildAssistSystemPrompt: jest.fn(() => 'system'),
  buildUserMessage: jest.fn((text: string) => text),
}));

import APIError from '@/app/interfaces/APIError';
import { checkBotId } from 'botid/server';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { callModel } from '@/app/utilities/providerSearch/assist/llm';
import { tryKeywordHit } from '@/app/utilities/providerSearch/assist/parse';
import { POST } from '@/app/api/search/assist/route';

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
    expect(callModel).not.toHaveBeenCalled();
  });

  it('refuses scripted clients', async () => {
    const response = await POST(
      makeRequest({ text: 'nursing in melbourne' }, { userAgent: 'curl/8.7.1' }),
    );

    expect(response.status).toBe(403);
    expect(callModel).not.toHaveBeenCalled();
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
    expect(callModel).not.toHaveBeenCalled();
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
});
