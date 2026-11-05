/**
 * @jest-environment node
 */
import { validateEmail } from '../validateEmail';

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
});
