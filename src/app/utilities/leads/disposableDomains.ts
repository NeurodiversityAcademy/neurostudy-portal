import 'server-only';

/**
 * Disposable / temporary mailbox domains.
 *
 * This list is intentionally bundled rather than fetched at runtime: a network
 * lookup on the capture path would add latency and a failure mode. Refresh it
 * quarterly. Domains are matched case-insensitively, including subdomains
 * (e.g. `abc.mailinator.com`).
 *
 * Privacy relays are NOT disposable and must remain absent:
 * `privaterelay.appleid.com`, `relay.firefox.com`.
 */
const DISPOSABLE_DOMAINS: ReadonlySet<string> = new Set([
  '10minutemail.com',
  '10minutemail.net',
  '20minutemail.com',
  '33mail.com',
  'anonbox.net',
  'burnermail.io',
  'discard.email',
  'discardmail.com',
  'dispostable.com',
  'dropmail.me',
  'emailondeck.com',
  'fakeinbox.com',
  'fakemailgenerator.com',
  'getairmail.com',
  'getnada.com',
  'guerrillamail.biz',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.info',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'harakirimail.com',
  'inboxkitten.com',
  'incognitomail.com',
  'jetable.org',
  'jourrapide.com',
  'mail.tm',
  'mail7.io',
  'mailcatch.com',
  'maildrop.cc',
  'mailexpire.com',
  'mailforspam.com',
  'mailinator.com',
  'mailinator.net',
  'mailinator2.com',
  'mailmetrash.com',
  'mailnesia.com',
  'mailnull.com',
  'mailsac.com',
  'mailtemp.info',
  'mailtothis.com',
  'mintemail.com',
  'moakt.com',
  'mohmal.com',
  'mytemp.email',
  'nada.email',
  'nolog.email',
  'one-time.email',
  'owlpic.com',
  'proxymail.eu',
  'punkass.com',
  'sharklasers.com',
  'shiftmail.com',
  'spam4.me',
  'spambox.us',
  'spamgourmet.com',
  'spamgourmet.net',
  'spamgourmet.org',
  'spamherelots.com',
  'spamhereplease.com',
  'spamspot.com',
  'spamthis.co.uk',
  'spamthisplease.com',
  'superrito.com',
  'tempail.com',
  'tempalias.com',
  'tempe-mail.com',
  'tempemail.biz',
  'tempemail.com',
  'tempemail.net',
  'tempinbox.co.uk',
  'tempinbox.com',
  'tempmail.co',
  'tempmail.com',
  'tempmail.de',
  'tempmail.eu',
  'tempmail.io',
  'tempmail.net',
  'tempmail.org',
  'tempmail.us.com',
  'tempmail2.com',
  'tempmailaddress.com',
  'tempmailer.com',
  'tempmailer.de',
  'tempomail.fr',
  'temporaryemail.net',
  'temporaryforwarding.com',
  'temporaryinbox.com',
  'temporarymailaddress.com',
  'thanksnospam.info',
  'thankyou2010.com',
  'thisisnotmyrealemail.com',
  'throwaway.email',
  'throwawaymail.com',
  'throwawaymail.net',
  'trash-mail.at',
  'trash-mail.com',
  'trash-mail.de',
  'trash2009.com',
  'trashdevil.com',
  'trashemail.de',
  'trashmail.at',
  'trashmail.com',
  'trashmail.de',
  'trashmail.io',
  'trashmail.me',
  'trashmail.net',
  'trashmail.org',
  'trashmail.ws',
  'trashymail.com',
  'trashymail.net',
  'trialmail.de',
  'tyldd.com',
  'uggsrock.com',
  'wegwerfmail.de',
  'wegwerfmail.net',
  'wegwerfmail.org',
  'wh4f.org',
  'whyspam.me',
  'willhackforfood.biz',
  'willselfdestruct.com',
  'xemaps.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'yopmail.org',
  'yuurok.com',
  'zehnminuten.de',
  'zehnminutenmail.de',
  'zippymail.info',
  'zoemail.org',
]);

/** True when the domain, or any parent domain, is a known disposable mailbox host. */
export function isDisposableEmailDomain(domain: string): boolean {
  const normalized = domain.trim().toLowerCase();
  if (normalized === '') {
    return false;
  }
  if (DISPOSABLE_DOMAINS.has(normalized)) {
    return true;
  }

  const labels = normalized.split('.');
  for (let index = 1; index < labels.length - 1; index += 1) {
    if (DISPOSABLE_DOMAINS.has(labels.slice(index).join('.'))) {
      return true;
    }
  }
  return false;
}
