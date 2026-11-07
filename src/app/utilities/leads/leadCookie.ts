import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const LEAD_COOKIE_NAME = 'nda_shortlist';
export const LEAD_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

const MIN_SECRET_LENGTH = 32;

export type LeadCookiePayload = {
  email: string;
  /** Unix epoch milliseconds. */
  exp: number;
};

function getSecret(): string | null {
  const secret = process.env.LEAD_COOKIE_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    return null;
  }
  return secret;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left, 'utf8');
  const b = Buffer.from(right, 'utf8');
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

export type SignedLeadCookie = {
  value: string;
  expiresAt: number;
};

/**
 * Creates the gate cookie value: `base64url(email|exp).base64url(HMAC-SHA256)`.
 * Returns `null` when `LEAD_COOKIE_SECRET` is missing or too short — fail closed.
 */
export function signLeadCookie(email: string, now: number = Date.now()): SignedLeadCookie | null {
  const secret = getSecret();
  if (!secret) {
    return null;
  }

  const expiresAt = now + LEAD_COOKIE_MAX_AGE_SECONDS * 1000;
  const payload = `${email}|${expiresAt}`;
  const encodedPayload = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = sign(payload, secret);

  return { value: `${encodedPayload}.${signature}`, expiresAt };
}

/** Verifies signature and expiry. Any tampering returns `null`. */
export function verifyLeadCookie(
  value: string | undefined | null,
  now: number = Date.now(),
): LeadCookiePayload | null {
  if (!value) {
    return null;
  }
  const secret = getSecret();
  if (!secret) {
    return null;
  }

  const parts = value.split('.');
  if (parts.length !== 2) {
    return null;
  }

  const [encodedPayload, signature] = parts;
  let payload: string;
  try {
    payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  } catch {
    return null;
  }

  if (!safeEqual(sign(payload, secret), signature)) {
    return null;
  }

  const separator = payload.lastIndexOf('|');
  if (separator <= 0) {
    return null;
  }

  const email = payload.slice(0, separator);
  const exp = Number.parseInt(payload.slice(separator + 1), 10);
  if (!email || !Number.isFinite(exp) || exp <= now) {
    return null;
  }

  return { email, exp };
}

export function hasValidLeadCookie(
  value: string | undefined | null,
  now: number = Date.now(),
): boolean {
  return verifyLeadCookie(value, now) !== null;
}

export function leadCookieOptions(): {
  httpOnly: true;
  secure: boolean;
  sameSite: 'lax';
  path: '/';
  maxAge: number;
} {
  return {
    httpOnly: true,
    // Local development runs on http://localhost, where Secure cookies are dropped.
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: LEAD_COOKIE_MAX_AGE_SECONDS,
  };
}
