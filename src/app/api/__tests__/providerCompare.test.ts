/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('@/app/utilities/api/rateLimiter', () => ({
  consumeRateWithIp: jest.fn().mockResolvedValue({ ip: '127.0.0.1', data: {} }),
}));

jest.mock('@/app/utilities/leads/providerCompare', () => ({
  isKnownProviderSlug: (slug: string) =>
    [
      'nepean-community-college',
      'campion-college-australia',
      'asa-institute-of-higher-education',
      'holmes-institute',
    ].includes(slug),
  buildCompareProvider: (slug: string) => ({
    slug,
    name: slug,
    tier: 'emerging',
    type: 'Emerging provider',
    locations: ['NSW'],
    ndaCertified: false,
    supportInPlace: null,
    supportInWorks: null,
    supportSections: [],
    qilt: null,
    detailHref: '',
  }),
}));

import { GET } from '@/app/api/providerCompare/route';

const SECRET = 'a'.repeat(32);

function makeRequest(path: string, cookie?: string): NextRequest {
  return new NextRequest(new URL(`http://localhost${path}`), {
    headers: cookie ? { cookie } : undefined,
  });
}

describe('GET /api/providerCompare', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      LEAD_CAPTURE_ENABLED: 'true',
      LEAD_COOKIE_SECRET: SECRET,
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns 404 when lead capture is not enabled', async () => {
    process.env.LEAD_CAPTURE_ENABLED = 'false';
    const response = await GET(makeRequest('/api/providerCompare?slugs=nepean-community-college'));
    expect(response.status).toBe(404);
  });

  it('allows direct compare requests without a gate cookie', async () => {
    const response = await GET(makeRequest('/api/providerCompare?slugs=nepean-community-college'));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      providers: [expect.objectContaining({ slug: 'nepean-community-college' })],
    });
  });

  it('returns the requested providers when unlocked', async () => {
    const response = await GET(
      makeRequest('/api/providerCompare?slugs=nepean-community-college,campion-college-australia'),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      providers: [
        expect.objectContaining({ slug: 'nepean-community-college' }),
        expect.objectContaining({ slug: 'campion-college-australia' }),
      ],
    });
  });

  it('Dedupes repeated slugs and rejects unknown ones', async () => {
    const deduped = await GET(
      makeRequest(
        '/api/providerCompare?slugs=nepean-community-college&slugs=nepean-community-college',
      ),
    );
    expect(deduped.status).toBe(200);
    expect((await deduped.json()).providers).toHaveLength(1);

    const unknown = await GET(makeRequest('/api/providerCompare?slugs=not-a-provider'));
    expect(unknown.status).toBe(400);
  });

  it('rejects more than three providers', async () => {
    const response = await GET(
      makeRequest(
        '/api/providerCompare?slugs=nepean-community-college,campion-college-australia,asa-institute-of-higher-education,holmes-institute',
      ),
    );
    expect(response.status).toBe(400);
  });
});
