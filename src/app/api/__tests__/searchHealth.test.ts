/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('@/app/utilities/api/rateLimiter', () => ({
  consumeRateWithIp: jest.fn(),
}));

jest.mock('@/app/utilities/providerSearch/assist/parse', () => ({
  tryKeywordHit: jest.fn(),
}));

import APIError from '@/app/interfaces/APIError';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { tryKeywordHit } from '@/app/utilities/providerSearch/assist/parse';
import { GET } from '@/app/api/search/health/route';

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(new URL('http://localhost:3000/api/search/health'), { headers });
}

describe('GET /api/search/health', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    jest.mocked(consumeRateWithIp).mockResolvedValue({ ip: '127.0.0.1', data: {} });
    jest.mocked(tryKeywordHit).mockReturnValue({
      area: 'Nursing',
      locations: ['Melbourne', 'VIC'],
    });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('confirms the deterministic keyword path', async () => {
    const response = await GET(makeRequest());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      area: 'Nursing',
      locations: ['Melbourne', 'VIC'],
      modelConfigured: false,
      cacheEnabled: true,
    });
  });

  it('fails the probe when the keyword path regresses', async () => {
    jest.mocked(tryKeywordHit).mockReturnValue(null);

    const response = await GET(makeRequest());

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      ok: false,
      reason: 'keyword_probe_failed',
      area: null,
      locations: [],
    });
  });

  it('requires the configured health token', async () => {
    process.env.SEARCH_HEALTH_TOKEN = 'probe-secret';

    const missing = await GET(makeRequest());
    expect(missing.status).toBe(403);

    const wrong = await GET(makeRequest({ 'x-health-token': 'nope' }));
    expect(wrong.status).toBe(403);

    const correct = await GET(makeRequest({ 'x-health-token': 'probe-secret' }));
    expect(correct.status).toBe(200);
  });

  it('returns 429 when the health probe is rate limited', async () => {
    jest
      .mocked(consumeRateWithIp)
      .mockRejectedValueOnce(new APIError({ status: 429, error: 'Too Many Requests.' }));

    const response = await GET(makeRequest());

    expect(response.status).toBe(429);
  });
});
