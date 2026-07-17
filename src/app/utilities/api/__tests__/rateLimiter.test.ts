/**
 * @jest-environment node
 */
const mockConsume = jest.fn();

jest.mock('rate-limiter-flexible', () => ({
  RateLimiterMemory: jest.fn().mockImplementation(() => ({
    consume: mockConsume,
  })),
}));

import APIError from '@/app/interfaces/APIError';
import { createMockNextRequest } from '@/testUtils/mockNextRequest';
import { consumeRateWithIp } from '../rateLimiter';

describe('rateLimiter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('consumes points using client IP and pathname', async () => {
    mockConsume.mockResolvedValue({ remainingPoints: 9 });

    const req = createMockNextRequest({
      url: 'http://localhost:3000/api/contact',
      headers: { 'x-forwarded-for': '203.0.113.1, 10.0.0.1' },
    });

    const result = await consumeRateWithIp(req, 2);

    expect(mockConsume).toHaveBeenCalledWith('203.0.113.1-/api/contact', 2);
    expect(result.ip).toBe('203.0.113.1');
    expect(result.data).toEqual({ remainingPoints: 9 });
  });

  it('falls back to x-real-ip when x-forwarded-for is absent', async () => {
    mockConsume.mockResolvedValue({ remainingPoints: 8 });

    const req = createMockNextRequest({
      url: 'http://localhost:3000/api/user',
      headers: { 'x-real-ip': '198.51.100.42' },
    });

    const result = await consumeRateWithIp(req);

    expect(mockConsume).toHaveBeenCalledWith('198.51.100.42-/api/user', undefined);
    expect(result.ip).toBe('198.51.100.42');
  });

  it('uses unknown IP when no forwarding headers are present', async () => {
    mockConsume.mockResolvedValue({ remainingPoints: 7 });

    const req = createMockNextRequest({
      url: 'http://localhost:3000/api/test',
    });

    const result = await consumeRateWithIp(req);

    expect(mockConsume).toHaveBeenCalledWith('unknown-/api/test', undefined);
    expect(result.ip).toBe('unknown');
  });

  it('throws APIError with 429 when rate limit is exceeded', async () => {
    mockConsume.mockRejectedValue(new Error('Rate limit'));

    const req = createMockNextRequest({
      url: 'http://localhost:3000/api/test',
      headers: { 'x-forwarded-for': '1.2.3.4' },
    });

    await expect(consumeRateWithIp(req)).rejects.toMatchObject({
      status: 429,
      message: 'Too Many Requests.',
    });

    await expect(consumeRateWithIp(req)).rejects.toBeInstanceOf(APIError);
  });

  it('ignores empty first IP in x-forwarded-for and falls back', async () => {
    mockConsume.mockResolvedValue({ remainingPoints: 6 });

    const req = createMockNextRequest({
      url: 'http://localhost:3000/api/test',
      headers: {
        'x-forwarded-for': ' , ',
        'x-real-ip': '10.0.0.5',
      },
    });

    const result = await consumeRateWithIp(req);

    expect(result.ip).toBe('10.0.0.5');
  });
});
