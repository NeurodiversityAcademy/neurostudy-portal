/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('@/app/utilities/api/rateLimiter', () => ({
  consumeRateWithIp: jest.fn().mockResolvedValue({ ip: '127.0.0.1', data: {} }),
}));

jest.mock('@/app/utilities/auth/isAuthenticated', () => jest.fn());

jest.mock('@/app/utilities/stripe/getStripe', () => jest.fn());

jest.mock('@/app/utilities/stripe/constants', () => ({
  STRIPE_INTRO_PRODUCT_PRICE_LOOKUP_KEY: 'test_price_key',
  STRIPE_PRICE_META_MOODLE_COURSE_ID_KEY: 'moodle_course_id',
  STRIPE_SHIPPING_ALLOWED_COUNTRIES: {
    AUSTRALIA: 'AU',
    USA: 'US',
    UNITED_KINGDOM: 'GB',
    CANADA: 'CA',
    NEW_ZEALAND: 'NZ',
  },
}));

jest.mock('@/app/utilities/db/processCourseAPIError', () =>
  jest.fn().mockImplementation((ex: unknown) => {
    const status = (ex as { status?: number })?.status || 500;
    return new Response(JSON.stringify({ message: (ex as Error)?.message || 'Error' }), { status });
  }),
);

import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import getStripe from '@/app/utilities/stripe/getStripe';
import { POST } from '@/app/api/course/createCheckoutUrl/route';

const mockConsumeRate = consumeRateWithIp as jest.Mock;
const mockIsAuth = isAuthenticated as jest.Mock;
const mockGetStripe = getStripe as jest.Mock;

const mockStripe = {
  prices: {
    list: jest.fn(),
  },
  checkout: {
    sessions: {
      create: jest.fn(),
    },
  },
};

const makeRequest = (): NextRequest =>
  new NextRequest(new URL('http://localhost/api/course/createCheckoutUrl'), {
    method: 'POST',
  });

describe('POST /api/course/createCheckoutUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsumeRate.mockResolvedValue({ ip: '127.0.0.1', data: {} });
    mockGetStripe.mockReturnValue(mockStripe);
  });

  it('returns checkout session URL for authenticated user', async () => {
    mockIsAuth.mockResolvedValue({ email: 'buyer@test.com' });
    mockStripe.prices.list.mockResolvedValue({
      data: [{ id: 'price_1', metadata: { moodle_course_id: '10' } }],
    });
    mockStripe.checkout.sessions.create.mockResolvedValue({
      url: 'https://checkout.stripe.com/session/123',
    });

    const res = await POST(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.url).toBe('https://checkout.stripe.com/session/123');
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_email: 'buyer@test.com',
        mode: 'payment',
      }),
    );
  });

  it('works for unauthenticated users (no customer_email)', async () => {
    mockIsAuth.mockResolvedValue(new Response(null, { status: 401 }));
    mockStripe.prices.list.mockResolvedValue({
      data: [{ id: 'price_1', metadata: { moodle_course_id: '10' } }],
    });
    mockStripe.checkout.sessions.create.mockResolvedValue({
      url: 'https://checkout.stripe.com/session/456',
    });

    const res = await POST(makeRequest());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.url).toBe('https://checkout.stripe.com/session/456');
  });

  it('returns error when no price found', async () => {
    mockIsAuth.mockResolvedValue({ email: 'buyer@test.com' });
    mockStripe.prices.list.mockResolvedValue({ data: [] });

    const res = await POST(makeRequest());

    expect(res.status).toBe(500);
  });

  it('returns error when price has no moodle course id metadata', async () => {
    mockIsAuth.mockResolvedValue({ email: 'buyer@test.com' });
    mockStripe.prices.list.mockResolvedValue({
      data: [{ id: 'price_1', metadata: {} }],
    });

    const res = await POST(makeRequest());

    expect(res.status).toBe(500);
  });

  it('returns error when rate limited', async () => {
    const APIError = (await import('@/app/interfaces/APIError')).default;
    mockConsumeRate.mockRejectedValue(new APIError({ status: 429, error: 'Too Many Requests.' }));

    const res = await POST(makeRequest());

    expect(res.status).toBe(429);
  });
});
