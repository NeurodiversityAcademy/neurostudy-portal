/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('@/app/utilities/api/rateLimiter', () => ({
  consumeRateWithIp: jest.fn().mockResolvedValue({ ip: '127.0.0.1', data: {} }),
}));

jest.mock('@/app/utilities/register/registerCRMContact', () => ({
  registerCRMContact: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock('@/app/utilities/register/registerSenderContact', () => ({
  registerSenderContact: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock('@/app/utilities/validation/validateUserSubscriptionData', () => ({
  isValidUserSubscriptionData: jest.fn(),
}));

jest.mock('@/app/utilities/api/processAPIError', () =>
  jest.fn().mockImplementation((err: Error | null) => {
    const status = (err as { status?: number })?.status || 500;
    return new Response(JSON.stringify({ message: err?.message || 'Server error' }), { status });
  }),
);

import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { registerSenderContact } from '@/app/utilities/register/registerSenderContact';
import { isValidUserSubscriptionData } from '@/app/utilities/validation/validateUserSubscriptionData';
import { POST } from '@/app/api/userSubscription/route';

const mockConsumeRate = consumeRateWithIp as jest.Mock;
const mockIsValid = isValidUserSubscriptionData as jest.Mock;
const mockRegisterCRM = registerCRMContact as jest.Mock;
const mockRegisterSender = registerSenderContact as jest.Mock;

const validData = {
  email: 'sub@test.com',
  firstName: 'Sub',
  lastName: 'User',
  getHandbook: false,
  hs_persona: 'persona_1',
};

const makeRequest = (body: unknown): NextRequest =>
  new NextRequest(new URL('http://localhost/api/userSubscription'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/userSubscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsumeRate.mockResolvedValue({ ip: '127.0.0.1', data: {} });
  });

  it('returns 200 with CRM and sender responses on valid data', async () => {
    mockIsValid.mockReturnValue(true);
    mockRegisterCRM.mockResolvedValue({ id: 'crm-1' });
    mockRegisterSender.mockResolvedValue({ id: 'sender-1' });

    const res = await POST(makeRequest(validData));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ crm: { id: 'crm-1' }, sender: { id: 'sender-1' } });
  });

  it('returns 400 when subscription data is invalid', async () => {
    mockIsValid.mockReturnValue(false);

    const res = await POST(makeRequest(validData));

    expect(res.status).toBe(400);
  });

  it('returns PDF when getHandbook is true and fetch succeeds', async () => {
    mockIsValid.mockReturnValue(true);
    const pdfBuffer = new ArrayBuffer(8);

    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(pdfBuffer),
    });

    const data = { ...validData, getHandbook: true };
    const res = await POST(makeRequest(data));

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/pdf');
    expect(res.headers.get('Content-Disposition')).toContain('NDA Handbook.pdf');

    global.fetch = originalFetch;
  });

  it('returns 500 when getHandbook is true but fetch fails', async () => {
    mockIsValid.mockReturnValue(true);

    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    const data = { ...validData, getHandbook: true };
    const res = await POST(makeRequest(data));

    expect(res.status).toBe(500);

    global.fetch = originalFetch;
  });

  it('returns 429 when rate limited', async () => {
    const APIError = (await import('@/app/interfaces/APIError')).default;
    mockConsumeRate.mockRejectedValue(new APIError({ status: 429, error: 'Too Many Requests.' }));

    const res = await POST(makeRequest(validData));

    expect(res.status).toBe(429);
  });

  it('returns 500 when registerCRMContact throws', async () => {
    mockIsValid.mockReturnValue(true);
    mockRegisterCRM.mockRejectedValue(new Error('CRM failure'));

    const res = await POST(makeRequest(validData));

    expect(res.status).toBe(500);
  });
});
