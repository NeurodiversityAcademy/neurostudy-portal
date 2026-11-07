/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('@/app/utilities/api/rateLimiter', () => ({
  consumeRateWithIp: jest.fn(),
}));

jest.mock('@/app/utilities/leads/leadFlags', () => ({
  isLeadCaptureEnabled: jest.fn(),
}));

jest.mock('@/app/utilities/register/shortlistCRM', () => ({
  findCRMContactByProperty: jest.fn(),
  updateCRMContact: jest.fn(),
}));

import APIError from '@/app/interfaces/APIError';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { isLeadCaptureEnabled } from '@/app/utilities/leads/leadFlags';
import { findCRMContactByProperty, updateCRMContact } from '@/app/utilities/register/shortlistCRM';
import { GET } from '@/app/api/shortlist/confirm/route';

const TOKEN = 'a'.repeat(64);
const DAY_MS = 24 * 60 * 60 * 1000;

function makeRequest(token: string = TOKEN): NextRequest {
  return new NextRequest(
    new URL(`http://localhost:3000/api/shortlist/confirm?t=${encodeURIComponent(token)}`),
  );
}

function contact(overrides: Record<string, unknown> = {}) {
  return {
    id: 'contact-1',
    properties: {
      nda_verify_status: 'pending',
      nda_shortlist_unlocked_at: new Date().toISOString(),
      ...overrides,
    },
  };
}

describe('GET /api/shortlist/confirm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(isLeadCaptureEnabled).mockReturnValue(true);
    jest.mocked(consumeRateWithIp).mockResolvedValue({ ip: '127.0.0.1', data: {} });
    jest.mocked(findCRMContactByProperty).mockResolvedValue(contact() as never);
    jest.mocked(updateCRMContact).mockResolvedValue(true);
  });

  it('returns 404 when lead capture is disabled', async () => {
    jest.mocked(isLeadCaptureEnabled).mockReturnValue(false);

    const response = await GET(makeRequest());

    expect(response.status).toBe(404);
    expect(await response.text()).toContain('This link is not active.');
  });

  it('returns 429 when the rate limiter rejects the request', async () => {
    jest
      .mocked(consumeRateWithIp)
      .mockRejectedValueOnce(new APIError({ status: 429, error: 'Too Many Requests.' }));

    const response = await GET(makeRequest());

    expect(response.status).toBe(429);
    expect(await response.text()).toContain('Please wait a moment');
  });

  it.each(['', 'short', 'Z'.repeat(64), 'a'.repeat(63)])(
    'returns 400 for an invalid token: %p',
    async (token) => {
      const response = await GET(makeRequest(token));

      expect(response.status).toBe(400);
      expect(findCRMContactByProperty).not.toHaveBeenCalled();
    },
  );

  it('returns 410 when the token is unknown or already used', async () => {
    jest.mocked(findCRMContactByProperty).mockResolvedValueOnce(null);

    const response = await GET(makeRequest());

    expect(response.status).toBe(410);
    expect(await response.text()).toContain('already been used');
  });

  it('returns 410 when the address bounced', async () => {
    jest
      .mocked(findCRMContactByProperty)
      .mockResolvedValueOnce(contact({ nda_verify_status: 'bounced' }) as never);

    const response = await GET(makeRequest());

    expect(response.status).toBe(410);
    expect(await response.text()).toContain('could not deliver email');
  });

  it.each([
    ['missing timestamp', undefined],
    ['invalid timestamp', 'not-a-date'],
    ['expired timestamp', new Date(Date.now() - 8 * DAY_MS).toISOString()],
  ])('returns 410 for an %s', async (_label, value) => {
    jest
      .mocked(findCRMContactByProperty)
      .mockResolvedValueOnce(contact({ nda_shortlist_unlocked_at: value }) as never);

    const response = await GET(makeRequest());

    expect(response.status).toBe(410);
    expect(await response.text()).toContain('has expired');
    expect(updateCRMContact).not.toHaveBeenCalled();
  });

  it('returns 502 when the CRM update fails', async () => {
    jest.mocked(updateCRMContact).mockResolvedValueOnce(false);

    const response = await GET(makeRequest());

    expect(response.status).toBe(502);
    expect(await response.text()).toContain('could not confirm your email');
  });

  it('confirms the email and clears the token', async () => {
    const response = await GET(makeRequest());

    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toContain('Email confirmed');
    expect(body).toContain('"confirmed"');
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(updateCRMContact).toHaveBeenCalledWith('contact-1', {
      nda_verify_status: 'verified',
      nda_verify_token: '',
    });
  });
});
