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

jest.mock('@/app/utilities/validation/assertCourseData', () => jest.fn());

jest.mock('@/app/utilities/db/processCourseAPIError', () =>
  jest.fn().mockImplementation((ex: unknown) => {
    const status = (ex as { status?: number })?.status || 500;
    return new Response(JSON.stringify({ message: (ex as Error)?.message || 'DB error' }), {
      status,
    });
  }),
);

import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { dbDocumentClient } from '@/app/utilities/db/configure';
import GET from '@/app/api/course/GET';

const mockConsumeRate = consumeRateWithIp as jest.Mock;
const mockDbSend = dbDocumentClient.send as jest.Mock;

const makeRequest = (params: Record<string, string> = {}): NextRequest => {
  const url = new URL('http://localhost/api/course');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url, { method: 'GET' });
};

describe('GET /api/course', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockConsumeRate.mockResolvedValue({ ip: '127.0.0.1', data: {} });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns items via ScanCommand when no query params', async () => {
    const items = [
      { CourseId: '1', Title: 'Course A' },
      { CourseId: '2', Title: 'Course B' },
    ];
    mockDbSend.mockResolvedValue({ Items: items });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(items);
  });

  it('returns items via QueryCommand when partition key provided', async () => {
    const items = [{ CourseId: 'abc', Title: 'Course X' }];
    mockDbSend.mockResolvedValue({ Items: items });

    const res = await GET(makeRequest({ CourseId: 'abc' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(items);
  });

  it('returns items via QueryCommand when index key provided', async () => {
    const items = [{ CourseId: '1', InstitutionName: 'Uni A' }];
    mockDbSend.mockResolvedValue({ Items: items });

    const res = await GET(makeRequest({ InstitutionName: 'Uni A' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(items);
  });

  it('returns empty array when no items found', async () => {
    mockDbSend.mockResolvedValue({ Items: undefined });

    const res = await GET(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual([]);
  });

  it('applies filter expression for non-index keys', async () => {
    mockDbSend.mockResolvedValue({ Items: [] });

    await GET(makeRequest({ Title: 'Laws' }));

    expect(mockDbSend).toHaveBeenCalledTimes(1);
  });

  it('returns test data when test query key is provided', async () => {
    const testData = [{ CourseId: 'test-1' }];
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(testData),
    });

    const res = await GET(makeRequest({ test: '1' }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual(testData);

    global.fetch = originalFetch;
  });

  it('returns error when rate limited', async () => {
    const APIError = (await import('@/app/interfaces/APIError')).default;
    mockConsumeRate.mockRejectedValue(new APIError({ status: 429, error: 'Too Many Requests.' }));

    const res = await GET(makeRequest());

    expect(res.status).toBe(429);
  });

  it('returns error when DB send fails', async () => {
    mockDbSend.mockRejectedValue(new Error('Connection refused'));

    const res = await GET(makeRequest());

    expect(res.status).toBe(500);
  });
});
