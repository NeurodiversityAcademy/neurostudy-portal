/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('@/app/utilities/api/rateLimiter', () => ({
  consumeRateWithIp: jest.fn().mockResolvedValue({ ip: '127.0.0.1', data: {} }),
}));

jest.mock('@/app/utilities/leads/providerCompare', () => ({
  isKnownProviderSlug: (slug: string) =>
    [
      'nepean-community-college',
      'campion-college-australia',
      'asa-institute-of-higher-education',
    ].includes(slug),
}));

jest.mock('@/app/utilities/leads/validateEmail', () => ({
  validateEmail: jest.fn(),
}));

jest.mock('@/app/utilities/register/registerCRMContact', () => ({
  registerCRMContact: jest.fn(),
}));

jest.mock('@/app/utilities/register/shortlistCRM', () => ({
  findCRMContactByProperty: jest.fn(),
  updateCRMContact: jest.fn(),
}));

jest.mock('@/app/utilities/leads/sendConfirmationEmail', () => ({
  sendShortlistConfirmationEmail: jest.fn().mockResolvedValue(false),
}));

import { validateEmail } from '@/app/utilities/leads/validateEmail';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { findCRMContactByProperty, updateCRMContact } from '@/app/utilities/register/shortlistCRM';
import { POST } from '@/app/api/shortlist/route';

const mockValidateEmail = validateEmail as jest.Mock;
const mockRegisterCRM = registerCRMContact as jest.Mock;
const mockFindCRM = findCRMContactByProperty as jest.Mock;
const mockUpdateCRM = updateCRMContact as jest.Mock;

const SECRET = 'a'.repeat(32);

function makeRequest(body: unknown): NextRequest {
  return new NextRequest(new URL('http://localhost/api/shortlist'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const validBody = {
  email: 'jane@example.com',
  consent: true,
  consentVersion: '2026-11-04',
  slugs: ['nepean-community-college', 'campion-college-australia'],
  filters: { interestAreas: ['IT'], locations: ['NSW'] },
};

describe('POST /api/shortlist', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      LEAD_CAPTURE_ENABLED: 'true',
      LEAD_COOKIE_SECRET: SECRET,
      NEXT_PUBLIC_HOST_URL: 'https://example.test',
    };
    mockValidateEmail.mockResolvedValue({ ok: true, email: 'jane@example.com' });
    mockFindCRM.mockResolvedValue(null);
    mockRegisterCRM.mockResolvedValue({ id: 'crm-1' });
    mockUpdateCRM.mockResolvedValue(true);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('captures a lead, sets the gate cookie, and does not echo the email', async () => {
    const response = await POST(makeRequest(validBody));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        ok: true,
        verification: 'pending_email_unconfigured',
        slugs: validBody.slugs,
      }),
    );
    expect(JSON.stringify(body)).not.toContain('jane@example.com');
    expect(response.headers.get('set-cookie')).toContain('nda_shortlist=');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');

    expect(mockRegisterCRM).toHaveBeenCalledWith({
      email: 'jane@example.com',
      nda_source: 'search_shortlist',
      nda_consent_version: '2026-11-04',
      nda_shortlist_unlocked_at: expect.any(String),
      nda_verify_token: expect.stringMatching(/^[a-f0-9]{64}$/),
      nda_verify_status: 'pending',
    });
    // Search filters are accepted but never stored.
    expect(mockRegisterCRM.mock.calls[0][0]).not.toHaveProperty('filters');
  });

  it('updates an existing contact instead of creating a duplicate', async () => {
    mockFindCRM.mockResolvedValue({ id: 'crm-existing', properties: {} });

    const response = await POST(makeRequest(validBody));

    expect(response.status).toBe(200);
    expect(mockUpdateCRM).toHaveBeenCalledWith(
      'crm-existing',
      expect.objectContaining({ email: 'jane@example.com' }),
    );
    expect(mockRegisterCRM).not.toHaveBeenCalled();
  });

  it('returns 404 when lead capture is not enabled', async () => {
    process.env.LEAD_CAPTURE_ENABLED = 'false';
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(404);
  });

  it('requires explicit consent', async () => {
    const response = await POST(makeRequest({ ...validBody, consent: false }));
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({ ok: false, reason: 'consent' });
  });

  it('requires a consent version', async () => {
    const response = await POST(makeRequest({ ...validBody, consentVersion: '' }));
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({ ok: false, reason: 'consent' });
  });

  it('surfaces the validation reason', async () => {
    mockValidateEmail.mockResolvedValue({ ok: false, reason: 'disposable' });
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({ ok: false, reason: 'disposable' });
    expect(mockRegisterCRM).not.toHaveBeenCalled();
  });

  it('rejects unknown slugs and more than three providers', async () => {
    const unknown = { ...validBody, slugs: ['not-a-provider'] };
    expect((await POST(makeRequest(unknown))).status).toBe(400);

    const tooMany = {
      ...validBody,
      slugs: [
        'nepean-community-college',
        'campion-college-australia',
        'asa-institute-of-higher-education',
        'nepean-community-college',
      ],
    };
    expect((await POST(makeRequest(tooMany))).status).toBe(400);
  });

  it('returns 502 when storage fails', async () => {
    mockRegisterCRM.mockResolvedValue(false);
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ ok: false, reason: 'storage_failed' });
  });

  it('fails closed when the cookie secret is missing', async () => {
    delete process.env.LEAD_COOKIE_SECRET;
    const response = await POST(makeRequest(validBody));
    expect(response.status).toBe(500);
  });
});
