# Bot and search protection

## Goal

AI crawlers and assistants may read public content. They must not drive provider
search.

The split matters because search is not content: it costs a model call, exposes
the full catalog to enumeration, and gives no referral traffic back.

## What the repository enforces

| Control                                                                                       | Where                                                                                    | Effect                                                                                  |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `robots.txt` allows content and disallows `/search`, `/api/`, `/profile`, `/login`, `/signup` | `src/app/robots.txt/route.ts`                                                            | Compliant crawlers (including GPTBot, ClaudeBot, PerplexityBot) stop before search.     |
| Search API refuses declared automation                                                        | `src/app/utilities/api/automationGuard.ts`, used by `src/app/api/search/assist/route.ts` | Returns `403` for AI/automation user agents, empty user agents, and cross-site callers. |
| Search API requires BotID                                                                    | `checkBotId()` in `src/app/api/search/assist/route.ts`                                   | Returns `403` when BotID classifies the caller as a bot or verified bot.                |
| Search results require BotID verification                                                    | `src/app/search/page.tsx` + `SearchVerification.tsx`                                     | First HTML response omits results; a verified browser gets a 15-minute signed cookie.   |
| Search API is rate limited                                                                    | `consumeRateWithIp` in the same route                                                    | 10 requests per minute per IP per path, in-memory.                                      |
| Search page is `noindex, nofollow`                                                            | `src/app/search/page.tsx` metadata                                                       | Search results never enter an index.                                                    |

These are friction, not a wall. A client can spoof its user agent or use a real
browser engine, so the edge rules below are the enforcement layer.

## How the BotID gate works

1. `/search` renders the banner and search form, but not provider results.
2. `SearchVerification` posts to `/api/verify`. BotID attaches its signals to
   that request (`src/instrumentation-client.ts`).
3. `/api/verify` calls `checkBotId()`. Humans get a signed
   `HttpOnly`/`Secure`/`SameSite=Strict` cookie valid for 15 minutes; bots get
   `403`.
4. The component refreshes the route. The server sees the cookie and renders
   results. After expiry, the browser verifies again.

Set `BOTID_COOKIE_SECRET` (32+ characters, for example `openssl rand -hex 32`)
to activate the gate. Without it the gate stays off and the page behaves as
before, so search cannot be taken down by a missing environment variable. The
gate is skipped in local development because BotID bypasses there.

Enable **Vercel BotID Deep Analysis** under Firewall → Rules for the best
detection. BotID requires a Pro or Enterprise plan and is billed per check.

## What must be configured in Vercel

Dashboard → Project → **Security → Firewall**. These settings live in the
Vercel account, not in this repository, and take effect without a deploy.

### 1. AI Bots managed ruleset — allow

Do **not** deny AI bots globally. The academy wants assistants to read provider
and course pages. Under **Bot Management → AI Bots**:

- AI crawlers: **Log** (or allow)
- AI assistants: **Log** (or allow)

The log is there to spot a crawler that ignores `robots.txt`; review it after a
week before tightening anything.

### 2. Custom rule — automation on search

Create a rule with these conditions:

- Path **is one of** `/search`, `/api/search/assist`
- User agent **matches** the AI/automation list: `GPTBot`, `ChatGPT-User`,
  `OAI-SearchBot`, `ClaudeBot`, `Claude-User`, `PerplexityBot`,
  `Perplexity-User`, `CCBot`, `Google-Extended`, `Bytespider`, `Amazonbot`,
  `meta-externalagent`, `curl`, `python-requests`, `wget`, `headlesschrome`

Action: **Deny** (or **Challenge** if you want a softer rollout). Test with
**Log** first and watch the 10-minute live traffic view.

### 3. Custom rule — search rate limit

- Path **starts with** `/search` or `/api/search`
- Rate limit: 30 requests per minute per IP, keyed by IP
- Follow-up action: **Challenge** for `/search`, **Deny** for `/api/search`

### 4. Custom rule — obvious attack paths

Deny paths ending in `.env`, `.git`, `.bak`, `.sql`, `.aws`, plus `/wp-admin`
and `/phpmyadmin`.

### 5. Verified bots and DDoS

- Keep **verified bots** allowed so Googlebot, Bingbot, and link previews work.
- Leave **DDoS Mitigation** on.
- If something is actively hammering the site, enable **Attack Mode** until it
  stops, then turn it off.

## Verify

```bash
# Content stays readable to AI crawlers
curl -A "GPTBot/1.2" -o /dev/null -w "%{http_code}\n" https://neurodiversityacademy.com/about
# 200

# Search API refuses automation
curl -A "GPTBot/1.2" -X POST https://neurodiversityacademy.com/api/search/assist \
  -H 'content-type: application/json' -d '{"text":"nursing in melbourne"}' -w "%{http_code}\n"
# 403

# robots.txt advertises the split
curl -s https://neurodiversityacademy.com/robots.txt

# A bare HTTP client gets no results (no BotID cookie, no cookie issuance)
curl -s -X POST https://neurodiversityacademy.com/api/verify -w "%{http_code}\n"
# 403
```

In a browser, open `/search?InterestArea=Nursing&Location=VIC`: the page should
show “Checking your browser…” briefly, then results. A curl request to the same
URL returns the shell without provider results.

## Limits

- A public HTML page can always be fetched by something that looks like a
  browser. The BotID gate means the first response carries no provider data;
  the WAF rule on `/search` still handles declared bots.
- BotID cannot verify the very first HTML response, which is why the signed
  cookie exists. Keep protected data out of the HTML until the cookie is valid.
- The in-memory rate limiter is per-instance and resets on deploy. The Vercel
  WAF rate limit is the durable one.
- `checkBotId()` fails open on technical errors in the ask route, so a BotID
  outage does not break search. The user-agent guard and rate limit still apply.
- Lead capture (`/api/shortlist`) is not BotID-protected yet. Add it the same
  way if fake signups appear.
