/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('@/app/utilities/api/rateLimiter', () => ({
  consumeRateWithIp: jest.fn(),
}));

import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { GET } from '@/app/api/test/route';

const mockConsumeRate = consumeRateWithIp as jest.Mock;

const makeRequest = (): NextRequest =>
  new NextRequest(new URL('http://localhost/api/test'), { method: 'GET' });

describe('GET /api/test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with rate limiter data on success', async () => {
    mockConsumeRate.mockResolvedValue({
      ip: '127.0.0.1',
      data: { remainingPoints: 9 },
    });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe(200);
    expect(body.data.ip).toBe('127.0.0.1');
  });

  it('returns 400 when rate limiter throws', async () => {
    const APIError = (await import('@/app/interfaces/APIError')).default;
    mockConsumeRate.mockRejectedValue(new APIError({ status: 429, error: 'Too Many Requests.' }));

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.status).toBe(400);
  });
});
