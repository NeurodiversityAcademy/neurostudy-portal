import 'server-only';
import { NextRequest } from 'next/server';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { isLeadCaptureEnabled } from '@/app/utilities/leads/leadFlags';
import { findCRMContactByProperty, updateCRMContact } from '@/app/utilities/register/shortlistCRM';
import { observeApi, type ApiTrace } from '@/app/utilities/observability/apiTrace';

export const runtime = 'nodejs';

const TOKEN_PATTERN = /^[a-f0-9]{64}$/;
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function htmlPage(
  title: string,
  message: string,
  status: number,
  verificationResult?: 'confirmed' | 'expired',
): Response {
  const result = verificationResult ?? 'expired';
  const body = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} | Neurodiversity Academy</title>
<style>
  body { margin: 0; padding: 3rem 1.5rem; background: #f7f5fb; color: #1a1a1a;
         font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { max-width: 34rem; margin: 0 auto; background: #fff; border-radius: 12px;
         padding: 2rem; box-shadow: 0 1px 20px rgba(0,0,0,.08); }
  h1 { font-size: 1.5rem; margin: 0 0 .75rem; }
  p { line-height: 1.6; margin: 0 0 1rem; }
  a { color: #6600cc; }
</style>
</head>
<body>
<main>
<h1>${title}</h1>
<p>${message}</p>
<p><a href="/search">Back to provider search</a></p>
</main>
<script>
  if (window.gtag) {
    window.gtag('event', 'lead_verify', {
      category: 'ProviderSearch',
      result: ${JSON.stringify(result)},
      page_path: '/api/shortlist/confirm'
    });
  }
</script>
</body>
</html>`;

  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function isExpired(unlockedAt: string | null | undefined): boolean {
  if (!unlockedAt) {
    return true;
  }
  const issued = Date.parse(unlockedAt);
  if (!Number.isFinite(issued)) {
    return true;
  }
  return Date.now() - issued > TOKEN_TTL_MS;
}

async function handleGet(request: NextRequest, trace: ApiTrace): Promise<Response> {
  trace.setUsage({ surface: 'api', mode: 'n/a', usedModel: false });

  if (!isLeadCaptureEnabled()) {
    trace.setOutcome('not_available', 'lead_capture_disabled');
    return htmlPage('Not available', 'This link is not active.', 404, 'expired');
  }

  try {
    await consumeRateWithIp(request);
  } catch {
    trace.setOutcome('rate_limited', 'rate_limit');
    return htmlPage('Too many requests', 'Please wait a moment and try again.', 429, 'expired');
  }

  const token = request.nextUrl.searchParams.get('t')?.trim() ?? '';
  if (!TOKEN_PATTERN.test(token)) {
    trace.setOutcome('invalid_request', 'invalid_token');
    return htmlPage('Invalid link', 'This confirmation link is not valid.', 400, 'expired');
  }

  const contact = await findCRMContactByProperty('nda_verify_token', token);
  if (!contact) {
    trace.setOutcome('expired', 'already_used_or_unknown');
    return htmlPage(
      'Link already used',
      'This confirmation link has already been used or has expired.',
      410,
      'expired',
    );
  }

  if (contact.properties.nda_verify_status === 'bounced') {
    trace.setOutcome('expired', 'email_bounced');
    return htmlPage(
      'Email could not be delivered',
      'We could not deliver email to this address. Please sign up again with a different address.',
      410,
      'expired',
    );
  }

  if (isExpired(contact.properties.nda_shortlist_unlocked_at)) {
    trace.setOutcome('expired', 'token_expired');
    return htmlPage(
      'Link expired',
      'This confirmation link has expired. Please request a new shortlist.',
      410,
      'expired',
    );
  }

  const updated = await updateCRMContact(contact.id, {
    nda_verify_status: 'verified',
    nda_verify_token: '',
  });
  if (!updated) {
    trace.setOutcome('storage_failed', 'crm_write');
    return htmlPage(
      'Something went wrong',
      'We could not confirm your email just now. Please try the link again shortly.',
      502,
      'expired',
    );
  }

  trace.setOutcome('confirmed', 'email_verified');
  return htmlPage(
    'Email confirmed',
    'Thanks — your email is confirmed. We will only email you about the shortlist you asked for.',
    200,
    'confirmed',
  );
}

export async function GET(request: NextRequest) {
  return observeApi('shortlist/confirm', request, (trace) => handleGet(request, trace));
}
