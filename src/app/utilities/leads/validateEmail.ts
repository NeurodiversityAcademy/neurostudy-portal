import 'server-only';
import { domainToASCII } from 'node:url';
import { resolveMx } from 'node:dns/promises';
import { isDisposableEmailDomain } from './disposableDomains';

export type EmailReason = 'syntax' | 'disposable' | 'no_mx' | 'role';

export type EmailVerdict = { ok: true; email: string } | { ok: false; reason: EmailReason };

export type MxLookup = (domain: string) => Promise<boolean>;

export type ValidateEmailOptions = {
  /** Test seam. Defaults to a cached DNS MX lookup. */
  lookupMx?: MxLookup;
};

const MAX_EMAIL_LENGTH = 254;
const MAX_LOCAL_LENGTH = 64;

/**
 * Deliberately strict: no quoted local parts, no IP literals, no consecutive dots.
 * Anything this rejects would also be rejected by the overwhelming majority of MTAs.
 */
const EMAIL_PATTERN =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/** Real people should not be writing from these. */
const ROLE_LOCAL_PARTS: ReadonlySet<string> = new Set([
  'admin',
  'administrator',
  'accounts',
  'billing',
  'contact',
  'enquiries',
  'enquiry',
  'help',
  'hello',
  'info',
  'mail',
  'marketing',
  'noreply',
  'no-reply',
  'office',
  'postmaster',
  'sales',
  'support',
  'test',
  'testing',
  'webmaster',
]);

/**
 * Privacy relays belong to real people. They must never be treated as disposable,
 * or we would block Apple "Hide My Email" and Firefox Relay users.
 */
const ALLOWED_PRIVACY_RELAY_DOMAINS: ReadonlySet<string> = new Set([
  'privaterelay.appleid.com',
  'relay.firefox.com',
]);

const MX_CACHE_TTL_MS = 10 * 60 * 1000;
const MX_TIMEOUT_MS = 1500;

const mxCache = new Map<string, { expiresAt: number; hasMx: boolean }>();

function isPrivacyRelay(domain: string): boolean {
  return ALLOWED_PRIVACY_RELAY_DOMAINS.has(domain);
}

function isRoleAddress(localPart: string): boolean {
  const base = localPart.split('+')[0];
  return ROLE_LOCAL_PARTS.has(base);
}

async function defaultLookupMx(domain: string): Promise<boolean> {
  if (isPrivacyRelay(domain)) {
    return true;
  }

  const cached = mxCache.get(domain);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.hasMx;
  }

  let hasMx = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const records = await Promise.race([
      resolveMx(domain),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('mx_timeout')), MX_TIMEOUT_MS);
      }),
    ]);
    hasMx = Array.isArray(records) && records.length > 0;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    // ENOTFOUND / ENODATA: the domain has no mail service.
    // Anything else (timeout, SERVFAIL) is not proof of a fake address, so let it through.
    hasMx = code !== 'ENOTFOUND' && code !== 'ENODATA';
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }

  mxCache.set(domain, { expiresAt: Date.now() + MX_CACHE_TTL_MS, hasMx });
  return hasMx;
}

/**
 * L1 syntax/length → L2 disposable blocklist → L4 role heuristic → L3 MX lookup.
 *
 * This is a heuristic ladder, not verification. Only a double opt-in click proves
 * that a human controls the mailbox.
 */
export async function validateEmail(
  raw: unknown,
  options: ValidateEmailOptions = {},
): Promise<EmailVerdict> {
  if (typeof raw !== 'string') {
    return { ok: false, reason: 'syntax' };
  }

  const trimmed = raw.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > MAX_EMAIL_LENGTH) {
    return { ok: false, reason: 'syntax' };
  }

  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    return { ok: false, reason: 'syntax' };
  }

  const localPart = trimmed.slice(0, atIndex);
  const rawDomain = trimmed.slice(atIndex + 1);
  if (localPart.length > MAX_LOCAL_LENGTH) {
    return { ok: false, reason: 'syntax' };
  }

  const asciiDomain = domainToASCII(rawDomain);
  if (asciiDomain === '') {
    return { ok: false, reason: 'syntax' };
  }

  const email = `${localPart}@${asciiDomain}`;
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, reason: 'syntax' };
  }

  if (!isPrivacyRelay(asciiDomain) && isDisposableEmailDomain(asciiDomain)) {
    return { ok: false, reason: 'disposable' };
  }

  if (isRoleAddress(localPart)) {
    return { ok: false, reason: 'role' };
  }

  const lookupMx = options.lookupMx ?? defaultLookupMx;
  if (!(await lookupMx(asciiDomain))) {
    return { ok: false, reason: 'no_mx' };
  }

  return { ok: true, email };
}

/** Test helper — clears the module-level MX cache. */
export function resetEmailValidationCacheForTests(): void {
  mxCache.clear();
}
