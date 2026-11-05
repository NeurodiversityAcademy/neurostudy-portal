import { NextRequest, NextResponse } from 'next/server';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import processAPIError from '@/app/utilities/api/processAPIError';
import { isLeadCaptureEnabled } from '@/app/utilities/leads/leadFlags';
import { buildCompareProvider, isKnownProviderSlug } from '@/app/utilities/leads/providerCompare';

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

export async function GET(request: NextRequest) {
  try {
    if (!isLeadCaptureEnabled()) {
      return NextResponse.json({ ok: false, reason: 'not_available' }, { status: 404 });
    }

    await consumeRateWithIp(request);

    const slugs = parseRequestedSlugs(request);
    if (!slugs) {
      return NextResponse.json({ ok: false, reason: 'invalid_request' }, { status: 400 });
    }

    const providers = slugs
      .map((slug) => buildCompareProvider(slug))
      .filter((provider): provider is NonNullable<typeof provider> => provider !== null);

    return NextResponse.json({ ok: true, providers });
  } catch (error) {
    return processAPIError(error instanceof Error ? error : null);
  }
}
