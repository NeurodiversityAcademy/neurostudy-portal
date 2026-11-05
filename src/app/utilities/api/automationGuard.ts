/**
 * Guards for endpoints that should only be driven by people using the site.
 *
 * AI crawlers and assistants are welcome to read public pages, but the provider
 * search API is a different thing: it costs a model call and exposes the whole
 * catalog to enumeration. These checks add friction there and nowhere else.
 *
 * This is not a security boundary on its own. A client can spoof its user agent,
 * so it is paired with robots.txt, per-IP rate limiting, and Vercel Firewall
 * rules scoped to the search paths.
 */

/** Declared AI, automation, and HTTP-library user agents. */
const AUTOMATION_USER_AGENT_PATTERNS = [
  // AI crawlers and assistants
  'gptbot',
  'chatgpt-user',
  'oai-searchbot',
  'claudebot',
  'claude-user',
  'claude-web',
  'anthropic-ai',
  'ccbot',
  'google-extended',
  'perplexitybot',
  'perplexity-user',
  'bytespider',
  'amazonbot',
  'applebot-extended',
  'cohere-ai',
  'diffbot',
  'youbot',
  'meta-externalagent',
  // Generic crawlers
  'bot',
  'spider',
  'crawler',
  // Scripted and headless clients
  'python-requests',
  'python-urllib',
  'aiohttp',
  'httpx',
  'curl/',
  'wget/',
  'node-fetch',
  'axios/',
  'go-http-client',
  'java/',
  'scrapy',
  'playwright',
  'puppeteer',
  'headlesschrome',
  'phantomjs',
];

/**
 * True when the request identifies itself as automation.
 *
 * A missing user agent counts as automation here: every browser sends one, so
 * an empty header means a script or a stripped client.
 */
export function isAutomationUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.trim() === '') {
    return true;
  }

  const value = userAgent.toLowerCase();
  return AUTOMATION_USER_AGENT_PATTERNS.some((pattern) => value.includes(pattern));
}

/**
 * True when the request did not originate from this site.
 *
 * `Sec-Fetch-Site` is sent by current browsers and cannot be set by page
 * JavaScript. `Origin` is the fallback for clients that omit it. A missing
 * `Origin` is allowed because same-origin GET/HEAD and some privacy tools omit
 * it; the user-agent and rate-limit checks still apply.
 */
export function isCrossSiteRequest(headers: Headers): boolean {
  const fetchSite = headers.get('sec-fetch-site')?.toLowerCase();
  if (fetchSite === 'cross-site') {
    return true;
  }

  const origin = headers.get('origin');
  const host = headers.get('host');
  if (!origin || !host) {
    return false;
  }

  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}
