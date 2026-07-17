/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('@/app/utilities/api/rateLimiter', () => ({
  consumeRateWithIp: jest.fn().mockResolvedValue({ ip: '127.0.0.1', data: {} }),
}));

jest.mock('@/app/utilities/db/configure', () => ({
  dbDocumentClient: { send: jest.fn() },
}));

jest.mock('@/app/utilities/validation/assertCourseDetailsData', () =>
  jest.fn()
);

jest.mock('@/app/utilities/db/processCourseAPIError', () =>
  jest.fn().mockImplementation((ex: unknown) => {
    const status = (ex as { status?: number })?.status || 500;
    return new Response(
      JSON.stringify({ message: (ex as Error)?.message || 'DB error' }),
      { status }
    );
  })
);

import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { dbDocumentClient } from '@/app/utilities/db/configure';
import GET from '@/app/api/course/details/GET';

const mockConsumeRate = consumeRateWithIp as jest.Mock;
const mockDbSend = dbDocumentClient.send as jest.Mock;

const makeRequest = (
  params: Record<string, string> = {}
): NextRequest => {
  const url = new URL('http://localhost/api/course/details');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url, { method: 'GET' });
};

describe('GET /api/course/details', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsumeRate.mockResolvedValue({ ip: '127.0.0.1', data: {} });
  });

  it('returns course details when valid id provided', async () => {
    const { marshall } = await import('@aws-sdk/util-dynamodb');
    const item = marshall({
      CourseId: 'abc',
      Title: 'Test Course',
      Overview: 'Overview text',
    });
    mockDbSend.mockResolvedValue({ Item: item });

    const res = await GET(makeRequest({ id: 'abc' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.CourseId).toBe('abc');
    expect(body.Title).toBe('Test Course');
  });

  it('returns error when no id provided', async () => {
    const res = await GET(makeRequest());

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toContain('id');
  });

  it('returns error when item not found', async () => {
    mockDbSend.mockResolvedValue({ Item: undefined });

    const res = await GET(makeRequest({ id: 'nonexistent' }));

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toContain('Invalid id');
  });

  it('returns error when rate limited', async () => {
    const APIError = (await import('@/app/interfaces/APIError')).default;
    mockConsumeRate.mockRejectedValue(
      new APIError({ status: 429, error: 'Too Many Requests.' })
    );

    const res = await GET(makeRequest({ id: 'abc' }));

    expect(res.status).toBe(429);
  });

  it('returns error when DB send fails', async () => {
    mockDbSend.mockRejectedValue(new Error('DB connection lost'));

    const res = await GET(makeRequest({ id: 'abc' }));

    expect(res.status).toBe(500);
  });
});
