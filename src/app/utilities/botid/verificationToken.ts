import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Short-lived proof that BotID verified this browser for search.
 *
 * The search page cannot be protected by BotID on its first HTML response: the
 * client script has not run yet. Instead, the page renders results only when
 * this signed token is present. A browser gets the token by calling
 * `/api/verify`, which is a BotID-protected POST.
 */
const PURPOSE = 'botid-verification';
const MIN_SECRET_LENGTH = 32;

export const BOTID_COOKIE_MAX_AGE_SECONDS = 15 * 60;

/** `__Host-` requires HTTPS, so local development uses a plain name. */
export function botIdCookieName(): string {
  return process.env.NODE_ENV === 'production' ? '__Host-nda_botid' : 'nda_botid';
}

function getSecret(): string | null {
  const secret = process.env.BOTID_COOKIE_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    return null;
  }
  return secret;
}

/**
 * The gate is only active when a signing secret is configured.
 *
 * Without it the search page behaves as before rather than failing closed and
 * taking search offline. The Vercel Firewall rules still apply either way.
 */
export function isBotIdGateEnabled(): boolean {
  return getSecret() !== null;
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

/** Token shape: `base64url(purpose|exp).base64url(HMAC-SHA256)`. */
export function signVerificationToken(now: number = Date.now()): string | null {
  const secret = getSecret();
  if (!secret) {
    return null;
  }

  const expiresAt = now + BOTID_COOKIE_MAX_AGE_SECONDS * 1000;
  const payload = `${PURPOSE}|${expiresAt}`;
  const encodedPayload = Buffer.from(payload, 'utf8').toString('base64url');

  return `${encodedPayload}.${sign(payload, secret)}`;
}

export type VerificationToken = {
  /** Unix epoch milliseconds. */
  expiresAt: number;
};

/** Verifies signature, purpose, and expiry. Any tampering returns `null`. */
export function verifyVerificationToken(
  value: string | undefined | null,
  now: number = Date.now(),
): VerificationToken | null {
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
  if (separator <= 0 || payload.slice(0, separator) !== PURPOSE) {
    return null;
  }

  const expiresAt = Number.parseInt(payload.slice(separator + 1), 10);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) {
    return null;
  }

  return { expiresAt };
}
