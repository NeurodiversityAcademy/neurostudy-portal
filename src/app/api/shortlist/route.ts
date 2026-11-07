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
import { observeApi, type ApiTrace } from '@/app/utilities/observability/apiTrace';

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

type ShortlistRequest = {
  email: unknown;
  consentVersion: string;
  slugs: string[];
};

type SignedLead = NonNullable<ReturnType<typeof signLeadCookie>>;

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

async function enforceShortlistGates(
  request: NextRequest,
  trace: ApiTrace,
): Promise<Response | null> {
  trace.setUsage({ surface: 'api', mode: 'n/a', usedModel: false });

  if (!isLeadCaptureEnabled()) {
    trace.setOutcome('not_available', 'lead_capture_disabled');
    return reject('not_available', 404);
  }

  try {
    await consumeRateWithIp(request);
    return null;
  } catch (error) {
    trace.setOutcome('rate_limited', 'rate_limit');
    throw error;
  }
}

/** Validates consent and slugs before any CRM or email work happens. */
async function readShortlistRequest(
  request: NextRequest,
  trace: ApiTrace,
): Promise<ShortlistRequest | Response> {
  let body: ShortlistBody;
  try {
    body = (await request.json()) as ShortlistBody;
  } catch {
    trace.setOutcome('invalid_request', 'malformed_json');
    return reject('invalid_request', 400);
  }

  if (body.consent !== true) {
    trace.setOutcome('consent_required', 'consent');
    return reject('consent');
  }

  const consentVersion = typeof body.consentVersion === 'string' ? body.consentVersion.trim() : '';
  if (consentVersion === '' || consentVersion.length > MAX_CONSENT_VERSION_LENGTH) {
    trace.setOutcome('consent_required', 'consent_version');
    return reject('consent');
  }

  const slugs = parseSlugs(body.slugs);
  if (!slugs) {
    trace.setOutcome('invalid_request', 'invalid_slugs');
    return reject('invalid_request', 400);
  }

  return { email: body.email, consentVersion, slugs };
}

/** Creates or updates the CRM contact. Returns false when the write failed. */
async function persistShortlistContact(
  email: string,
  consentVersion: string,
  token: string,
  trace: ApiTrace,
): Promise<boolean> {
  const contact: ShortlistCRMContact = {
    email,
    nda_source: 'search_shortlist',
    nda_consent_version: consentVersion,
    nda_shortlist_unlocked_at: new Date().toISOString(),
    nda_verify_token: token,
    nda_verify_status: 'pending',
  };

  const existing = await findCRMContactByProperty('email', email);
  const stored = existing
    ? await updateCRMContact(existing.id, contact)
    : (await registerCRMContact(contact)) !== false;

  if (!stored) {
    trace.setOutcome('storage_failed', 'crm_write');
  }
  return stored;
}

async function completeShortlist(
  request: NextRequest,
  email: string,
  token: string,
  slugs: string[],
  signed: SignedLead,
  trace: ApiTrace,
): Promise<NextResponse> {
  const confirmUrl = `${confirmationBaseUrl(request)}/api/shortlist/confirm?t=${token}`;
  const emailSent = await sendShortlistConfirmationEmail({ email, confirmUrl });

  const response = json(200, {
    ok: true,
    verification: emailSent ? 'pending' : 'pending_email_unconfigured',
    unlockedUntil: new Date(signed.expiresAt).toISOString(),
    slugs,
  });
  response.cookies.set(LEAD_COOKIE_NAME, signed.value, leadCookieOptions());

  trace.setUsage({ emailSent });
  trace.setOutcome('ok', emailSent ? 'shortlist_created' : 'shortlist_created_email_unconfigured');
  return response;
}

async function handlePost(request: NextRequest, trace: ApiTrace): Promise<Response> {
  try {
    const blocked = await enforceShortlistGates(request, trace);
    if (blocked) {
      return blocked;
    }

    const parsed = await readShortlistRequest(request, trace);
    if (parsed instanceof Response) {
      return parsed;
    }
    trace.setUsage({ slugCount: parsed.slugs.length });

    const verdict = await validateEmail(parsed.email);
    if (!verdict.ok) {
      trace.setOutcome('invalid_request', `email_${verdict.reason}`);
      return reject(verdict.reason);
    }

    const token = randomBytes(TOKEN_BYTES).toString('hex');
    const stored = await persistShortlistContact(
      verdict.email,
      parsed.consentVersion,
      token,
      trace,
    );
    if (!stored) {
      return reject('storage_failed', 502);
    }

    const signed = signLeadCookie(verdict.email);
    if (!signed) {
      // Missing/short LEAD_COOKIE_SECRET: do not hand out an unsigned gate.
      trace.setOutcome('error', 'lead_cookie_secret_missing');
      throw new APIError({ status: 500, error: 'Lead capture is not configured.' });
    }

    return await completeShortlist(request, verdict.email, token, parsed.slugs, signed, trace);
  } catch (error) {
    if (error instanceof APIError && error.status < 500) {
      // The specific outcome was already recorded above.
      return processAPIError(error);
    }
    trace.setOutcome('error', 'unhandled_route_error');
    return processAPIError(error instanceof Error ? error : null);
  }
}

export async function POST(request: NextRequest) {
  return observeApi('shortlist', request, (trace) => handlePost(request, trace));
}
