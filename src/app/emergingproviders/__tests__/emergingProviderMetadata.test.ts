import cardData from '@/app/components/emergingInstitutions/emergingInstitutions.json';
import {
  buildEmergingProviderDetailHref,
  buildEmergingProviderMetadata,
  resolveEmergingProviderForSlug,
} from '../emergingProviderMetadata';
import { slugify } from '@/app/utilities/common';
import { HOST_URL } from '@/app/utilities/constants';

describe('buildEmergingProviderDetailHref', () => {
  it('returns the detail path for a slug', () => {
    expect(buildEmergingProviderDetailHref('bond-university')).toBe(
      '/emergingproviders/bond-university',
    );
  });

  it('returns empty string for an empty slug', () => {
    expect(buildEmergingProviderDetailHref('')).toBe('');
  });
});

describe('resolveEmergingProviderForSlug', () => {
  it('resolves a known emerging provider slug', () => {
    const provider = resolveEmergingProviderForSlug('bond-university');

    expect(provider).toEqual(
      expect.objectContaining({
        slug: 'bond-university',
        name: 'Bond University',
      }),
    );
    expect(provider?.heroInfoItems.length).toBeGreaterThan(0);
    expect(provider?.providerStats.length).toBeGreaterThan(0);
  });

  it('returns null for an unknown slug', () => {
    expect(resolveEmergingProviderForSlug('unknown-institute')).toBeNull();
  });
});

describe('buildEmergingProviderMetadata', () => {
  it('returns SEO metadata for a valid emerging provider', () => {
    const slug = 'griffith-university';
    const metadata = buildEmergingProviderMetadata(slug);
    const canonical = `${HOST_URL}/emergingproviders/${slug}`;

    expect(metadata).toEqual({
      title: 'Griffith University | NDA Emerging Provider',
      description:
        'Explore student experience insights and neuro-inclusive profile for Griffith University.',
      alternates: { canonical },
      openGraph: {
        title: 'Griffith University | NDA Emerging Provider',
        description:
          'Explore student experience insights and neuro-inclusive profile for Griffith University.',
        url: canonical,
      },
    });
  });

  it('returns not-found metadata for an unknown slug', () => {
    expect(buildEmergingProviderMetadata('does-not-exist')).toEqual({ title: 'Not found' });
  });

  it('builds unique metadata for every listed emerging institution', () => {
    for (const { name } of cardData) {
      const metadata = buildEmergingProviderMetadata(slugify(name));

      expect(metadata).toEqual(
        expect.objectContaining({
          title: `${name} | NDA Emerging Provider`,
          description: `Explore student experience insights and neuro-inclusive profile for ${name}.`,
        }),
      );
      expect(metadata.alternates?.canonical).toBe(`${HOST_URL}/emergingproviders/${slugify(name)}`);
    }
  });
});
