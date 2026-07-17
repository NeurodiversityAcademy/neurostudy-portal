/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';

jest.mock('@/app/utilities/api/rateLimiter', () => ({
  consumeRateWithIp: jest.fn().mockResolvedValue({ ip: '127.0.0.1', data: {} }),
}));

jest.mock('@/app/utilities/auth/isAuthenticated', () => jest.fn());
jest.mock('@/app/utilities/auth/getUser', () => jest.fn());

jest.mock('@/app/utilities/stripe/getStripe', () => jest.fn());
jest.mock('@/app/utilities/stripe/constants', () => ({
  STRIPE_PRICE_META_MOODLE_COURSE_ID_KEY: 'moodle_course_id',
  STRIPE_SESSION_EXPANDABLE_ITEMS: {
    CUSTOMER: 'customer',
    LINE_ITEMS: 'line_items',
  },
  STRIPE_SESSION_ID_KEY: 'session_id',
  STRIPE_SESSION_PAYMENT_STATUS: {
    PAID: 'paid',
    UNPAID: 'unpaid',
    NO_PAYMENT_REQUIRED: 'no_payment_required',
  },
}));

jest.mock('@/app/utilities/moodle/getMoodleUserByEmail', () => ({
  getMoodleUserByEmail: jest.fn(),
}));
jest.mock('@/app/utilities/moodle/createMoodleUser', () => ({
  createMoodleUser: jest.fn(),
}));
jest.mock('@/app/utilities/moodle/enrolMoodleUserInCourse', () => ({
  enrolMoodleUserInCourse: jest.fn(),
}));
jest.mock('@/app/utilities/moodle/helper', () => ({
  getMoodleCourseUrl: jest.fn().mockReturnValue('https://moodle.test/course/10'),
}));

jest.mock('@/app/utilities/common', () => ({
  getSearchQuery: jest.fn().mockImplementation(
    (params: Record<string, unknown>) =>
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join('&')
  ),
}));

jest.mock('@/app/utilities/constants', () => ({
  HOST_URL: 'http://localhost:3000',
}));

import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import getUser from '@/app/utilities/auth/getUser';
import getStripe from '@/app/utilities/stripe/getStripe';
import { getMoodleUserByEmail } from '@/app/utilities/moodle/getMoodleUserByEmail';
import { createMoodleUser } from '@/app/utilities/moodle/createMoodleUser';
import { enrolMoodleUserInCourse } from '@/app/utilities/moodle/enrolMoodleUserInCourse';
import { GET } from '@/app/api/course/checkoutCallback/route';

const mockConsumeRate = consumeRateWithIp as jest.Mock;
const mockIsAuth = isAuthenticated as jest.Mock;
const mockGetUser = getUser as jest.Mock;
const mockGetStripe = getStripe as jest.Mock;
const mockGetMoodleUser = getMoodleUserByEmail as jest.Mock;
const mockCreateMoodleUser = createMoodleUser as jest.Mock;
const mockEnrolUser = enrolMoodleUserInCourse as jest.Mock;

const mockStripe = {
  checkout: {
    sessions: {
      retrieve: jest.fn(),
    },
  },
};

const makePaidSession = (overrides = {}) => ({
  payment_status: 'paid',
  customer_details: {
    email: 'buyer@test.com',
    name: 'Buyer Name',
  },
  line_items: {
    data: [
      {
        price: {
          metadata: { moodle_course_id: '10' },
        },
      },
    ],
  },
  ...overrides,
});

const makeRequest = (params: Record<string, string> = {}): NextRequest => {
  const url = new URL('http://localhost/api/course/checkoutCallback');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url, { method: 'GET' });
};

describe('GET /api/course/checkoutCallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsumeRate.mockResolvedValue({ ip: '127.0.0.1', data: {} });
    mockGetStripe.mockReturnValue(mockStripe);
  });

  it('redirects to moodle course URL on success with existing user', async () => {
    mockStripe.checkout.sessions.retrieve.mockResolvedValue(makePaidSession());
    mockGetMoodleUser.mockResolvedValue({ id: 42 });
    mockEnrolUser.mockResolvedValue(undefined);
    mockIsAuth.mockResolvedValue({ email: 'buyer@test.com' });
    mockGetUser.mockResolvedValue({ email: 'buyer@test.com' });

    const res = await GET(makeRequest({ session_id: 'sess_123' }));

    expect(res.status).toBe(307);
    expect(res.headers.get('Location')).toBe('https://moodle.test/course/10');
    expect(mockEnrolUser).toHaveBeenCalledWith({ userid: 42, courseid: 10 });
    expect(mockStripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
      'sess_123',
      expect.objectContaining({
        expand: expect.arrayContaining(['customer', 'line_items']),
      })
    );
  });

  it('creates moodle user when none exists', async () => {
    mockStripe.checkout.sessions.retrieve.mockResolvedValue(makePaidSession());
    mockGetMoodleUser.mockResolvedValue(null);
    mockCreateMoodleUser.mockResolvedValue({ id: 99 });
    mockEnrolUser.mockResolvedValue(undefined);
    mockIsAuth.mockResolvedValue({ email: 'buyer@test.com' });
    mockGetUser.mockResolvedValue({ email: 'buyer@test.com' });

    const res = await GET(makeRequest({ session_id: 'sess_123' }));

    expect(mockCreateMoodleUser).toHaveBeenCalledWith({
      email: 'buyer@test.com',
      name: 'Buyer Name',
    });
    expect(res.status).toBe(307);
  });

  it('redirects to signup when user does not exist', async () => {
    mockStripe.checkout.sessions.retrieve.mockResolvedValue(makePaidSession());
    mockGetMoodleUser.mockResolvedValue({ id: 42 });
    mockEnrolUser.mockResolvedValue(undefined);
    mockIsAuth.mockResolvedValue(
      new AuthErrorResponse(null, { status: 401 })
    );
    mockGetUser.mockResolvedValue(null);

    const res = await GET(makeRequest({ session_id: 'sess_123' }));

    expect(res.status).toBe(307);
    const location = res.headers.get('Location') || '';
    expect(location).toContain('/signup');
    expect(location).toContain('checkout_status=success');
  });

  it('redirects to failure when no session_id provided', async () => {
    const res = await GET(makeRequest());

    expect(res.status).toBe(307);
    const location = res.headers.get('Location') || '';
    expect(location).toContain('checkout_status=failure');
  });

  it('redirects to failure when payment not completed', async () => {
    mockStripe.checkout.sessions.retrieve.mockResolvedValue({
      payment_status: 'unpaid',
    });

    const res = await GET(makeRequest({ session_id: 'sess_123' }));

    expect(res.status).toBe(307);
    const location = res.headers.get('Location') || '';
    expect(location).toContain('checkout_status=failure');
  });

  it('redirects to failure when customer has no email', async () => {
    mockStripe.checkout.sessions.retrieve.mockResolvedValue(
      makePaidSession({
        customer_details: { email: null, name: 'No Email' },
      })
    );

    const res = await GET(makeRequest({ session_id: 'sess_123' }));

    expect(res.status).toBe(307);
    const location = res.headers.get('Location') || '';
    expect(location).toContain('checkout_status=failure');
  });

  it('redirects to failure when rate limited', async () => {
    const APIError = (await import('@/app/interfaces/APIError')).default;
    mockConsumeRate.mockRejectedValue(
      new APIError({ status: 429, error: 'Too Many Requests.' })
    );

    const res = await GET(makeRequest({ session_id: 'sess_123' }));

    expect(res.status).toBe(307);
    const location = res.headers.get('Location') || '';
    expect(location).toContain('checkout_status=failure');
  });
});
