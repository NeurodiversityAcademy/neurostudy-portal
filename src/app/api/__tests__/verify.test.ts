/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('botid/server', () => ({
  checkBotId: jest.fn(),
}));

jest.mock('@/app/utilities/api/rateLimiter', () => ({
  consumeRateWithIp: jest.fn(),
}));

jest.mock('@/app/utilities/botid/verificationCookie', () => ({
  hasVerificationCookie: jest.fn(),
  issueVerificationCookie: jest.fn(),
}));

import APIError from '@/app/interfaces/APIError';
import { checkBotId } from 'botid/server';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import {
  hasVerificationCookie,
  issueVerificationCookie,
} from '@/app/utilities/botid/verificationCookie';
import { POST } from '@/app/api/verify/route';

const HUMAN = {
  isHuman: true,
  isBot: false,
  isVerifiedBot: false,
  bypassed: false,
};

function makeRequest(): NextRequest {
  return new NextRequest(new URL('http://localhost:3000/api/verify'), {
    method: 'POST',
    headers: { 'user-agent': 'Mozilla/5.0 Chrome/131.0.0.0' },
  });
}

describe('POST /api/verify', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(consumeRateWithIp).mockResolvedValue({ ip: '127.0.0.1', data: {} });
    jest.mocked(hasVerificationCookie).mockResolvedValue(false);
    jest.mocked(issueVerificationCookie).mockResolvedValue(true);
    jest.mocked(checkBotId).mockResolvedValue(HUMAN);
  });

  it('reuses an existing verification cookie without a new BotID check', async () => {
    jest.mocked(hasVerificationCookie).mockResolvedValue(true);

    const response = await POST(makeRequest());

    expect(response.status).toBe(204);
    expect(checkBotId).not.toHaveBeenCalled();
    expect(issueVerificationCookie).not.toHaveBeenCalled();
  });

  it('issues a cookie for a verified human', async () => {
    const response = await POST(makeRequest());

    expect(response.status).toBe(204);
    expect(issueVerificationCookie).toHaveBeenCalled();
  });

  it('refuses bots and verified bots', async () => {
    jest.mocked(checkBotId).mockResolvedValueOnce({ ...HUMAN, isHuman: false, isBot: true });
    const bot = await POST(makeRequest());

    jest.mocked(checkBotId).mockResolvedValueOnce({
      ...HUMAN,
      isHuman: false,
      isVerifiedBot: true,
    });
    const verifiedBot = await POST(makeRequest());

    expect(bot.status).toBe(403);
    expect(verifiedBot.status).toBe(403);
    expect(issueVerificationCookie).not.toHaveBeenCalled();
  });

  it('returns 429 when the rate limiter rejects the request', async () => {
    jest
      .mocked(consumeRateWithIp)
      .mockRejectedValueOnce(new APIError({ status: 429, error: 'Too Many Requests.' }));

    const response = await POST(makeRequest());

    expect(response.status).toBe(429);
  });

  it('does not cache verification responses', async () => {
    const response = await POST(makeRequest());

    expect(response.headers.get('cache-control')).toBe('private, no-store');
  });
});
