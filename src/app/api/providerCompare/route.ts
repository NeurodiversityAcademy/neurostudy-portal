import { NextRequest, NextResponse } from 'next/server';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import processAPIError from '@/app/utilities/api/processAPIError';
import { isLeadCaptureEnabled } from '@/app/utilities/leads/leadFlags';
import { buildCompareProvider, isKnownProviderSlug } from '@/app/utilities/leads/providerCompare';
import { observeApi, type ApiTrace } from '@/app/utilities/observability/apiTrace';

export const runtime = 'nodejs';

const MAX_SLUGS = 3;

function parseRequestedSlugs(request: NextRequest): string[] | null {
  const raw = request.nextUrl.searchParams.getAll('slugs').flatMap((value) => value.split(','));
  const slugs: string[] = [];
  for (const entry of raw) {
    const slug = entry.trim();
    if (slug === '') {
      continue;
    }
    if (!isKnownProviderSlug(slug)) {
      return null;
    }
    if (!slugs.includes(slug)) {
      slugs.push(slug);
    }
  }
  if (slugs.length === 0 || slugs.length > MAX_SLUGS) {
    return null;
  }
  return slugs;
}

async function handleGet(request: NextRequest, trace: ApiTrace): Promise<Response> {
  try {
    trace.setUsage({ surface: 'api', mode: 'n/a', usedModel: false });

    if (!isLeadCaptureEnabled()) {
      trace.setOutcome('not_available', 'lead_capture_disabled');
      return NextResponse.json({ ok: false, reason: 'not_available' }, { status: 404 });
    }

    try {
      await consumeRateWithIp(request);
    } catch (error) {
      trace.setOutcome('rate_limited', 'rate_limit');
      throw error;
    }

    const slugs = parseRequestedSlugs(request);
    if (!slugs) {
      trace.setOutcome('invalid_request', 'invalid_slugs');
      return NextResponse.json({ ok: false, reason: 'invalid_request' }, { status: 400 });
    }

    trace.setUsage({ slugCount: slugs.length });

    const providers = slugs
      .map((slug) => buildCompareProvider(slug))
      .filter((provider): provider is NonNullable<typeof provider> => provider !== null);

    trace.setOutcome('ok', 'compare_served');
    return NextResponse.json({ ok: true, providers });
  } catch (error) {
    trace.setOutcome('error', 'unhandled_route_error');
    return processAPIError(error instanceof Error ? error : null);
  }
}

export async function GET(request: NextRequest) {
  return observeApi('providerCompare', request, (trace) => handleGet(request, trace));
}
