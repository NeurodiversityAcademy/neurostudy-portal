import { RateLimiterMemory } from 'rate-limiter-flexible';
import {
  API_CONSUMPTION_INTERVAL,
  API_POINT_CONSUMPTION_LIMIT,
} from './constants';
import { NextRequest } from 'next/server';

const rateLimiter = new RateLimiterMemory({
  points: API_POINT_CONSUMPTION_LIMIT,
  duration: API_CONSUMPTION_INTERVAL,
});

export const consumeRateWithIp = async (
  req: NextRequest,
  pointsToConsume?: number
) => {
  const ip =
    req.ip ||
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';

  try {
    const res = await rateLimiter.consume(ip, pointsToConsume);

    return { ip, data: res };
  } catch (ex) {
    throw { ip, error: ex };
  }
};

export default rateLimiter;