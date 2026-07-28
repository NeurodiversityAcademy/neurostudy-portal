import {
  INSTITUTION_PROVIDER_HEADER_KIND,
  type InstitutionProviderHeader,
} from '../institutionProviderHeader';

describe('institutionProviderHeader', () => {
  it('exports defined kind strings for every header variant', () => {
    expect(INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT).toBe('emergingDefault');
    expect(INSTITUTION_PROVIDER_HEADER_KIND.YELLOW).toBe('yellow');
    expect(INSTITUTION_PROVIDER_HEADER_KIND.CHERRY_PIE_SUB).toBe('cherryPieSub');
    expect(INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE).toBe('remoteImage');

    for (const kind of Object.values(INSTITUTION_PROVIDER_HEADER_KIND)) {
      expect(kind).toEqual(expect.any(String));
      expect(kind.length).toBeGreaterThan(0);
    }
  });

  it('keeps REMOTE_IMAGE kind when building a serializable header object', () => {
    const header: InstitutionProviderHeader = {
      kind: INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE,
      src: '/images/NepeanCover.webp',
    };

    // Mimic RSC JSON round-trip (undefined fields are dropped).
    const serialized = JSON.parse(JSON.stringify(header)) as InstitutionProviderHeader;
    expect(serialized).toEqual({
      kind: 'remoteImage',
      src: '/images/NepeanCover.webp',
    });
  });
});
