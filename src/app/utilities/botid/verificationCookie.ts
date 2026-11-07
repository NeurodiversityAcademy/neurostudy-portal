import 'server-only';
import { cookies } from 'next/headers';
import {
  BOTID_COOKIE_MAX_AGE_SECONDS,
  botIdCookieName,
  signVerificationToken,
  verifyVerificationToken,
} from './verificationToken';

export { BOTID_COOKIE_MAX_AGE_SECONDS, isBotIdGateEnabled } from './verificationToken';

export async function hasVerificationCookie(now: number = Date.now()): Promise<boolean> {
  const store = await cookies();
  return verifyVerificationToken(store.get(botIdCookieName())?.value, now) !== null;
}

/** Returns false when the gate is disabled or no signing secret is configured. */
export async function issueVerificationCookie(): Promise<boolean> {
  const token = signVerificationToken();
  if (!token) {
    return false;
  }

  const store = await cookies();
  store.set(botIdCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: BOTID_COOKIE_MAX_AGE_SECONDS,
  });

  return true;
}
