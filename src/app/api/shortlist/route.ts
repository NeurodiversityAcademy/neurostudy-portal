import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import APIError from '@/app/interfaces/APIError';
import type { ShortlistCRMContact } from '@/app/interfaces/ShortlistCRMContact';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import processAPIError from '@/app/utilities/api/processAPIError';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { findCRMContactByProperty, updateCRMContact } from '@/app/utilities/register/shortlistCRM';
import { validateEmail } from '@/app/utilities/leads/validateEmail';
import {
  LEAD_COOKIE_NAME,
  leadCookieOptions,
  signLeadCookie,
} from '@/app/utilities/leads/leadCookie';
import { isLeadCaptureEnabled } from '@/app/utilities/leads/leadFlags';
import { isKnownProviderSlug } from '@/app/utilities/leads/providerCompare';
import { sendShortlistConfirmationEmail } from '@/app/utilities/leads/sendConfirmationEmail';

export const runtime = 'nodejs';

const MAX_SLUGS = 3;
const MAX_CONSENT_VERSION_LENGTH = 64;
const TOKEN_BYTES = 32;

type ShortlistBody = {
  email?: unknown;
  consent?: unknown;
  consentVersion?: unknown;
  slugs?: unknown;
};

function json(status: number, body: Record<string, unknown>): NextResponse {
  return NextResponse.json(body, { status });
}

function reject(reason: string, status = 422): NextResponse {
  return json(status, { ok: false, reason });
}

function parseSlugs(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }
  if (value.length === 0 || value.length > MAX_SLUGS) {
    return null;
  }
  const slugs: string[] = [];
  for (const entry of value) {
    if (typeof entry !== 'string' || !isKnownProviderSlug(entry)) {
      return null;
    }
    if (!slugs.includes(entry)) {
      slugs.push(entry);
    }
  }
  return slugs;
}

function confirmationBaseUrl(request: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_HOST_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }
  return new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  try {
    if (!isLeadCaptureEnabled()) {
      return reject('not_available', 404);
    }

    await consumeRateWithIp(request);

    let body: ShortlistBody;
    try {
      body = (await request.json()) as ShortlistBody;
    } catch {
      return reject('invalid_request', 400);
    }

    if (body.consent !== true) {
      return reject('consent');
    }

    const consentVersion =
      typeof body.consentVersion === 'string' ? body.consentVersion.trim() : '';
    if (consentVersion === '' || consentVersion.length > MAX_CONSENT_VERSION_LENGTH) {
      return reject('consent');
    }

    const slugs = parseSlugs(body.slugs);
    if (!slugs) {
      return reject('invalid_request', 400);
    }

    const verdict = await validateEmail(body.email);
    if (!verdict.ok) {
      return reject(verdict.reason);
    }

    const token = randomBytes(TOKEN_BYTES).toString('hex');
    const unlockedAt = new Date().toISOString();

    const contact: ShortlistCRMContact = {
      email: verdict.email,
      nda_source: 'search_shortlist',
      nda_consent_version: consentVersion,
      nda_shortlist_unlocked_at: unlockedAt,
      nda_verify_token: token,
      nda_verify_status: 'pending',
    };

    const existing = await findCRMContactByProperty('email', verdict.email);
    const stored = existing
      ? await updateCRMContact(existing.id, contact)
      : (await registerCRMContact(contact)) !== false;

    if (!stored) {
      return reject('storage_failed', 502);
    }

    const signed = signLeadCookie(verdict.email);
    if (!signed) {
      // Missing/short LEAD_COOKIE_SECRET: do not hand out an unsigned gate.
      throw new APIError({ status: 500, error: 'Lead capture is not configured.' });
    }

    const confirmUrl = `${confirmationBaseUrl(request)}/api/shortlist/confirm?t=${token}`;
    const emailSent = await sendShortlistConfirmationEmail({
      email: verdict.email,
      confirmUrl,
    });

    const response = json(200, {
      ok: true,
      verification: emailSent ? 'pending' : 'pending_email_unconfigured',
      unlockedUntil: new Date(signed.expiresAt).toISOString(),
      slugs,
    });
    response.cookies.set(LEAD_COOKIE_NAME, signed.value, leadCookieOptions());
    return response;
  } catch (error) {
    return processAPIError(error instanceof Error ? error : null);
  }
}
