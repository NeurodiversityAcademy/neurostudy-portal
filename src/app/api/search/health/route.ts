import { NextRequest, NextResponse } from 'next/server';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { loadProviderSearchContext } from '@/app/utilities/providerSearch/catalog';
import { tryKeywordHit } from '@/app/utilities/providerSearch/assist/parse';
import { observeApi, type ApiTrace } from '@/app/utilities/observability/apiTrace';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EXPECTED_AREA = 'Nursing';
const EXPECTED_LOCATIONS = ['Melbourne', 'VIC'];

/**
 * Synthetic probe for the deterministic search path.
 *
 * Azure Monitor runs this hourly and alerts on a non-200. It never calls the
 * model and never returns PII. Set SEARCH_HEALTH_TOKEN to require a header.
 */
async function handleGet(request: NextRequest, trace: ApiTrace): Promise<Response> {
  trace.setUsage({ surface: 'api', mode: 'n/a', usedModel: false });

  try {
    await consumeRateWithIp(request);
  } catch {
    trace.setOutcome('rate_limited', 'rate_limit');
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 });
  }

  const requiredToken = process.env.SEARCH_HEALTH_TOKEN?.trim();
  if (requiredToken && request.headers.get('x-health-token') !== requiredToken) {
    trace.setOutcome('forbidden', 'health_token');
    return NextResponse.json({ ok: false, reason: 'forbidden' }, { status: 403 });
  }

  const context = loadProviderSearchContext();
  const hit = tryKeywordHit('nursing in melbourne', context);
  const locations = hit?.locations ?? [];
  const healthy =
    hit?.area === EXPECTED_AREA &&
    EXPECTED_LOCATIONS.every((location) => locations.includes(location));

  trace.setDecision({ path: 'keyword', area: hit?.area ?? null, locations });

  if (!healthy) {
    trace.setOutcome('error', 'keyword_probe_failed');
    return NextResponse.json(
      { ok: false, reason: 'keyword_probe_failed', area: hit?.area ?? null, locations },
      { status: 503 },
    );
  }

  trace.setOutcome('ok', 'keyword_probe');
  return NextResponse.json({
    ok: true,
    area: hit.area,
    locations,
    modelConfigured: Boolean(
      process.env.ASSIST_API_URL && process.env.ASSIST_API_KEY && process.env.ASSIST_MODEL,
    ),
    cacheEnabled: process.env.ASSIST_CACHE !== 'off',
  });
}

export async function GET(request: NextRequest) {
  return observeApi('search/health', request, (trace) => handleGet(request, trace));
}
