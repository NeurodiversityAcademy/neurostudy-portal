/**
 * @jest-environment node
 */
jest.mock('node:dns/promises', () => ({
  resolveMx: jest.fn(),
}));

import { resolveMx } from 'node:dns/promises';
import { resetEmailValidationCacheForTests, validateEmail } from '../validateEmail';

const acceptMx = jest.fn().mockResolvedValue(true);
const rejectMx = jest.fn().mockResolvedValue(false);

describe('validateEmail', () => {
  it.each([
    undefined,
    null,
    123,
    '',
    '   ',
    'a@b',
    'a@@b.com',
    'a b@c.com',
    '.a@b.com',
    'a.@b.com',
  ])('rejects syntax: %p', async (value) => {
    await expect(validateEmail(value, { lookupMx: acceptMx })).resolves.toEqual({
      ok: false,
      reason: 'syntax',
    });
  });

  it('rejects over-length local parts and addresses', async () => {
    const longLocal = `${'a'.repeat(65)}@example.com`;
    const longAddress = `${'a'.repeat(60)}@${'b'.repeat(190)}.com`;
    await expect(validateEmail(longLocal, { lookupMx: acceptMx })).resolves.toEqual({
      ok: false,
      reason: 'syntax',
    });
    await expect(validateEmail(longAddress, { lookupMx: acceptMx })).resolves.toEqual({
      ok: false,
      reason: 'syntax',
    });
  });

  it('normalises case and whitespace', async () => {
    await expect(
      validateEmail('  Jane.Doe@Example.COM  ', { lookupMx: acceptMx }),
    ).resolves.toEqual({ ok: true, email: 'jane.doe@example.com' });
  });

  it('accepts internationalised domains via punycode', async () => {
    await expect(validateEmail('jane@münchen.de', { lookupMx: acceptMx })).resolves.toEqual({
      ok: true,
      email: 'jane@xn--mnchen-3ya.de',
    });
  });

  it('rejects disposable domains, including subdomains', async () => {
    await expect(validateEmail('jane@mailsac.com', { lookupMx: acceptMx })).resolves.toEqual({
      ok: false,
      reason: 'disposable',
    });
    await expect(validateEmail('jane@box.mailinator.com', { lookupMx: acceptMx })).resolves.toEqual(
      { ok: false, reason: 'disposable' },
    );
  });

  it('allows Apple and Firefox privacy relays', async () => {
    await expect(
      validateEmail('jane@privaterelay.appleid.com', { lookupMx: acceptMx }),
    ).resolves.toEqual({ ok: true, email: 'jane@privaterelay.appleid.com' });
    await expect(validateEmail('jane@relay.firefox.com', { lookupMx: acceptMx })).resolves.toEqual({
      ok: true,
      email: 'jane@relay.firefox.com',
    });
  });

  it('rejects role addresses, including plus-addressed roles', async () => {
    await expect(validateEmail('info@example.com', { lookupMx: acceptMx })).resolves.toEqual({
      ok: false,
      reason: 'role',
    });
    await expect(validateEmail('admin+web@example.com', { lookupMx: acceptMx })).resolves.toEqual({
      ok: false,
      reason: 'role',
    });
  });

  it('rejects domains with no mail service', async () => {
    await expect(validateEmail('jane@example.com', { lookupMx: rejectMx })).resolves.toEqual({
      ok: false,
      reason: 'no_mx',
    });
  });

  it('accepts a valid personal address', async () => {
    await expect(
      validateEmail('jane.doe+study@example.com', { lookupMx: acceptMx }),
    ).resolves.toEqual({ ok: true, email: 'jane.doe+study@example.com' });
  });

  describe('default MX lookup', () => {
    beforeEach(() => {
      resetEmailValidationCacheForTests();
      jest.mocked(resolveMx).mockReset();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('accepts a domain with MX records', async () => {
      jest.mocked(resolveMx).mockResolvedValue([{ exchange: 'mail.example.com', priority: 10 }]);

      await expect(validateEmail('jane@has-mx.example')).resolves.toEqual({
        ok: true,
        email: 'jane@has-mx.example',
      });
    });

    it('rejects a domain with an empty MX answer', async () => {
      jest.mocked(resolveMx).mockResolvedValue([]);

      await expect(validateEmail('jane@empty-mx.example')).resolves.toEqual({
        ok: false,
        reason: 'no_mx',
      });
    });

    it.each(['ENOTFOUND', 'ENODATA'])('rejects a nonexistent domain (%s)', async (code) => {
      jest.mocked(resolveMx).mockRejectedValue(Object.assign(new Error(code), { code }));

      await expect(validateEmail(`jane@missing-${code.toLowerCase()}.example`)).resolves.toEqual({
        ok: false,
        reason: 'no_mx',
      });
    });

    it('fails open on transient DNS errors', async () => {
      jest
        .mocked(resolveMx)
        .mockRejectedValue(Object.assign(new Error('timeout'), { code: 'ETIMEOUT' }));

      await expect(validateEmail('jane@flaky-dns.example')).resolves.toEqual({
        ok: true,
        email: 'jane@flaky-dns.example',
      });
    });

    it('caches lookups for the same domain', async () => {
      jest.mocked(resolveMx).mockResolvedValue([{ exchange: 'mail.example.com', priority: 10 }]);

      await validateEmail('jane@cached.example');
      await validateEmail('john@cached.example');

      expect(resolveMx).toHaveBeenCalledTimes(1);
    });

    it('skips DNS for privacy relays', async () => {
      await expect(validateEmail('jane@privaterelay.appleid.com')).resolves.toEqual({
        ok: true,
        email: 'jane@privaterelay.appleid.com',
      });
      expect(resolveMx).not.toHaveBeenCalled();
    });

    it('fails open when DNS does not answer before the timeout', async () => {
      jest.useFakeTimers();
      jest.mocked(resolveMx).mockReturnValue(new Promise<never>(() => {}));

      const pending = validateEmail('jane@slow-dns.example');
      jest.advanceTimersByTime(1500);

      await expect(pending).resolves.toEqual({ ok: true, email: 'jane@slow-dns.example' });
    });
  });
});
