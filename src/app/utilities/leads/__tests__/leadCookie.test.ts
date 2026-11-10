/**
 * @jest-environment node
 */
import {
  LEAD_COOKIE_MAX_AGE_SECONDS,
  leadCookieOptions,
  signLeadCookie,
  verifyLeadCookie,
} from '../leadCookie';

const SECRET = 'a'.repeat(32);

describe('lead cookie', () => {
  const originalSecret = process.env.LEAD_COOKIE_SECRET;

  beforeEach(() => {
    process.env.LEAD_COOKIE_SECRET = SECRET;
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.LEAD_COOKIE_SECRET;
    } else {
      process.env.LEAD_COOKIE_SECRET = originalSecret;
    }
  });

  it('round-trips a signed value', () => {
    const signed = signLeadCookie('jane@example.com');
    expect(signed).not.toBeNull();
    expect(verifyLeadCookie(signed?.value)).toEqual({
      email: 'jane@example.com',
      exp: signed?.expiresAt,
    });
  });

  it('rejects tampered payloads and signatures', () => {
    const signed = signLeadCookie('jane@example.com');
    const [payload, signature] = signed!.value.split('.');
    const forgedPayload = Buffer.from(`attacker@example.com|${signed!.expiresAt}`).toString(
      'base64url',
    );

    expect(verifyLeadCookie(`${forgedPayload}.${signature}`)).toBeNull();
    expect(verifyLeadCookie(`${payload}.${'b'.repeat(signature.length)}`)).toBeNull();
    expect(verifyLeadCookie(`${payload}.${signature}.extra`)).toBeNull();
    expect(verifyLeadCookie('not-a-cookie')).toBeNull();
    expect(verifyLeadCookie(undefined)).toBeNull();
  });

  it('rejects expired values', () => {
    const now = Date.now();
    const signed = signLeadCookie('jane@example.com', now);
    expect(
      verifyLeadCookie(signed?.value, now + LEAD_COOKIE_MAX_AGE_SECONDS * 1000 + 1),
    ).toBeNull();
  });

  it('fails closed without a strong secret', () => {
    delete process.env.LEAD_COOKIE_SECRET;
    expect(signLeadCookie('jane@example.com')).toBeNull();

    process.env.LEAD_COOKIE_SECRET = 'too-short';
    expect(signLeadCookie('jane@example.com')).toBeNull();

    const signed = signLeadCookie('jane@example.com', Date.now());
    // Signed while the secret was invalid: nothing to verify.
    expect(signed).toBeNull();
  });

  it('uses httpOnly and lax cookie options', () => {
    expect(leadCookieOptions()).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: LEAD_COOKIE_MAX_AGE_SECONDS,
    });
  });
});
