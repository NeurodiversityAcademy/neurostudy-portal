import { isAutomationUserAgent, isCrossSiteRequest } from '@/app/utilities/api/automationGuard';

function headers(entries: Record<string, string>): Headers {
  return new Headers(entries);
}

describe('isAutomationUserAgent', () => {
  it('treats a missing or empty user agent as automation', () => {
    expect(isAutomationUserAgent(null)).toBe(true);
    expect(isAutomationUserAgent(undefined)).toBe(true);
    expect(isAutomationUserAgent('')).toBe(true);
    expect(isAutomationUserAgent('   ')).toBe(true);
  });

  it('detects declared AI crawlers and assistants', () => {
    expect(isAutomationUserAgent('GPTBot/1.2 (+https://openai.com/gptbot)')).toBe(true);
    expect(isAutomationUserAgent('Mozilla/5.0 ChatGPT-User/2.0')).toBe(true);
    expect(isAutomationUserAgent('ClaudeBot/1.0')).toBe(true);
    expect(isAutomationUserAgent('PerplexityBot/1.0')).toBe(true);
    expect(isAutomationUserAgent('CCBot/2.0')).toBe(true);
  });

  it('detects scripted and headless clients', () => {
    expect(isAutomationUserAgent('curl/8.7.1')).toBe(true);
    expect(isAutomationUserAgent('python-requests/2.32.3')).toBe(true);
    expect(isAutomationUserAgent('node-fetch/3.3.2')).toBe(true);
    expect(isAutomationUserAgent('Mozilla/5.0 HeadlessChrome/120.0.0.0')).toBe(true);
  });

  it('allows normal browsers', () => {
    expect(
      isAutomationUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      ),
    ).toBe(false);
    expect(
      isAutomationUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1',
      ),
    ).toBe(false);
  });
});

describe('isCrossSiteRequest', () => {
  it('rejects requests the browser marks as cross-site', () => {
    expect(isCrossSiteRequest(headers({ 'sec-fetch-site': 'cross-site' }))).toBe(true);
  });

  it('allows same-origin and same-site requests', () => {
    expect(isCrossSiteRequest(headers({ 'sec-fetch-site': 'same-origin' }))).toBe(false);
    expect(isCrossSiteRequest(headers({ 'sec-fetch-site': 'same-site' }))).toBe(false);
    expect(isCrossSiteRequest(headers({ 'sec-fetch-site': 'none' }))).toBe(false);
  });

  it('compares the origin host with the request host', () => {
    expect(
      isCrossSiteRequest(
        headers({ origin: 'https://neurodiversityacademy.com', host: 'neurodiversityacademy.com' }),
      ),
    ).toBe(false);

    expect(
      isCrossSiteRequest(
        headers({ origin: 'https://evil.example', host: 'neurodiversityacademy.com' }),
      ),
    ).toBe(true);
  });

  it('treats an unparsable origin as cross-site', () => {
    expect(isCrossSiteRequest(headers({ origin: 'null', host: 'neurodiversityacademy.com' }))).toBe(
      true,
    );
  });

  it('allows requests without origin or host information', () => {
    expect(isCrossSiteRequest(headers({}))).toBe(false);
    expect(isCrossSiteRequest(headers({ origin: 'https://neurodiversityacademy.com' }))).toBe(
      false,
    );
  });
});
