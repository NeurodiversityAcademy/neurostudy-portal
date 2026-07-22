import {
  ENDORSED_PROVIDERS_HEADING,
  NDA_CERTIFIED_LEGEND,
  resolveEndorsedProviderLogoSrc,
} from '@/app/utilities/endorsedProvidersDemo';

describe('endorsedProvidersDemo', () => {
  it('resolveEndorsedProviderLogoSrc returns fallback when slug missing', () => {
    expect(resolveEndorsedProviderLogoSrc('unknown', '/fallback.png', {})).toBe('/fallback.png');
  });

  it('resolveEndorsedProviderLogoSrc returns override when slug present', () => {
    const override = { src: '/override.png', width: 1, height: 1 };
    expect(
      resolveEndorsedProviderLogoSrc('collarts', '/fallback.png', {
        collarts: override,
      }),
    ).toBe(override);
  });

  it('ENDORSED_PROVIDERS_HEADING is defined', () => {
    expect(ENDORSED_PROVIDERS_HEADING.length).toBeGreaterThan(0);
  });

  it('NDA_CERTIFIED_LEGEND uses training wording', () => {
    expect(NDA_CERTIFIED_LEGEND).toBe('NDA Certified — completed Neurodiversity Academy training');
  });
});
