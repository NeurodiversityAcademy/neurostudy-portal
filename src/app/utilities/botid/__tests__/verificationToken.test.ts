import { createHmac } from 'node:crypto';
import {
  BOTID_COOKIE_MAX_AGE_SECONDS,
  isBotIdGateEnabled,
  signVerificationToken,
  verifyVerificationToken,
} from '@/app/utilities/botid/verificationToken';

const SECRET = 'a'.repeat(32);
const NOW = 1_700_000_000_000;

function signPayload(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function makeToken(payload: string): string {
  return `${Buffer.from(payload, 'utf8').toString('base64url')}.${signPayload(payload)}`;
}

describe('verificationToken', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, BOTID_COOKIE_SECRET: SECRET };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('signs a token that verifies within its lifetime', () => {
    const token = signVerificationToken(NOW);

    expect(token).not.toBeNull();
    expect(verifyVerificationToken(token, NOW)).toEqual({
      expiresAt: NOW + BOTID_COOKIE_MAX_AGE_SECONDS * 1000,
    });
  });

  it('rejects an expired token', () => {
    const token = signVerificationToken(NOW);
    const afterExpiry = NOW + BOTID_COOKIE_MAX_AGE_SECONDS * 1000 + 1;

    expect(verifyVerificationToken(token, afterExpiry)).toBeNull();
  });

  it('rejects tampered payloads and signatures', () => {
    const token = signVerificationToken(NOW);
    const [payload, signature] = token?.split('.') ?? [];

    expect(verifyVerificationToken(`${payload}x.${signature}`, NOW)).toBeNull();
    expect(verifyVerificationToken(`${payload}.${'x'.repeat(signature.length)}`, NOW)).toBeNull();
    expect(verifyVerificationToken('not-a-token', NOW)).toBeNull();
    expect(verifyVerificationToken(undefined, NOW)).toBeNull();
  });

  it('rejects a correctly signed token with the wrong purpose', () => {
    const expiresAt = NOW + 60_000;
    const token = makeToken(`some-other-purpose|${expiresAt}`);

    expect(verifyVerificationToken(token, NOW)).toBeNull();
  });

  it('is disabled when the secret is missing or too short', () => {
    process.env.BOTID_COOKIE_SECRET = 'short';

    expect(isBotIdGateEnabled()).toBe(false);
    expect(signVerificationToken(NOW)).toBeNull();
    expect(verifyVerificationToken('anything', NOW)).toBeNull();
  });

  it('is enabled when a 32-character secret is configured', () => {
    expect(isBotIdGateEnabled()).toBe(true);
  });
});
