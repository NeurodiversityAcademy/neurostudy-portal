/**
 * @jest-environment node
 */
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { cookies } from 'next/headers';
import {
  BOTID_COOKIE_MAX_AGE_SECONDS,
  hasVerificationCookie,
  issueVerificationCookie,
} from '../verificationCookie';
import { signVerificationToken } from '../verificationToken';

const SECRET = 'b'.repeat(32);
const NOW = 1_700_000_000_000;

type CookieStore = {
  get: jest.Mock;
  set: jest.Mock;
};

function store(value?: string): CookieStore {
  return {
    get: jest.fn().mockReturnValue(value === undefined ? undefined : { value }),
    set: jest.fn(),
  };
}

function useStore(cookieStore: CookieStore): void {
  jest.mocked(cookies).mockResolvedValue(cookieStore as never);
}

describe('verificationCookie', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, BOTID_COOKIE_SECRET: SECRET };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('hasVerificationCookie', () => {
    it('accepts a freshly signed cookie', async () => {
      const token = signVerificationToken(NOW);
      const cookieStore = store(token ?? undefined);
      useStore(cookieStore);

      await expect(hasVerificationCookie(NOW)).resolves.toBe(true);
      expect(cookieStore.get).toHaveBeenCalledWith('nda_botid');
    });

    it('rejects a missing cookie', async () => {
      useStore(store());

      await expect(hasVerificationCookie(NOW)).resolves.toBe(false);
    });

    it('rejects an expired cookie', async () => {
      const token = signVerificationToken(NOW);
      useStore(store(token ?? undefined));

      await expect(
        hasVerificationCookie(NOW + BOTID_COOKIE_MAX_AGE_SECONDS * 1000 + 1),
      ).resolves.toBe(false);
    });

    it('rejects a tampered cookie value', async () => {
      useStore(store('not-a-valid-token'));

      await expect(hasVerificationCookie(NOW)).resolves.toBe(false);
    });
  });

  describe('issueVerificationCookie', () => {
    it('sets an httpOnly cookie with the expected options', async () => {
      const cookieStore = store();
      useStore(cookieStore);

      await expect(issueVerificationCookie()).resolves.toBe(true);

      expect(cookieStore.set).toHaveBeenCalledTimes(1);
      const [name, value, options] = cookieStore.set.mock.calls[0] as [
        string,
        string,
        Record<string, unknown>,
      ];
      expect(name).toBe('nda_botid');
      expect(typeof value).toBe('string');
      expect(options).toEqual({
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: BOTID_COOKIE_MAX_AGE_SECONDS,
      });
    });

    it('uses the __Host- prefix and secure cookies in production', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        const cookieStore = store();
        useStore(cookieStore);

        await expect(issueVerificationCookie()).resolves.toBe(true);

        const [name, , options] = cookieStore.set.mock.calls[0] as [
          string,
          string,
          Record<string, unknown>,
        ];
        expect(name).toBe('__Host-nda_botid');
        expect(options.secure).toBe(true);
      } finally {
        process.env.NODE_ENV = originalNodeEnv;
      }
    });

    it('does nothing when no signing secret is configured', async () => {
      delete process.env.BOTID_COOKIE_SECRET;
      const cookieStore = store();
      useStore(cookieStore);

      await expect(issueVerificationCookie()).resolves.toBe(false);
      expect(cookies).not.toHaveBeenCalled();
      expect(cookieStore.set).not.toHaveBeenCalled();
    });
  });
});
