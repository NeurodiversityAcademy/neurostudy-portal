import { RateLimiterMemory } from 'rate-limiter-flexible';
import { API_CONSUMPTION_INTERVAL, API_POINT_CONSUMPTION_LIMIT } from './constants';
import { NextRequest } from 'next/server';
import APIError from '@/app/interfaces/APIError';

const rateLimiter = new RateLimiterMemory({
  points: API_POINT_CONSUMPTION_LIMIT,
  duration: API_CONSUMPTION_INTERVAL,
});

const getClientIp = (req: NextRequest): string => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  return req.headers.get('x-real-ip') || 'unknown';
};

export const consumeRateWithIp = async (req: NextRequest, pointsToConsume?: number) => {
  const ip = getClientIp(req);
  const pathname = new URL(req.url).pathname;

  try {
    const res = await rateLimiter.consume(ip + '-' + pathname, pointsToConsume);

    return { ip, data: res };
  } catch {
    throw new APIError({ status: 429, error: 'Too Many Requests.' });
  }
};

export default rateLimiter;
