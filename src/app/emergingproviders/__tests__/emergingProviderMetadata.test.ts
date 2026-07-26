import cardData from '@/app/components/emergingInstitutions/emergingInstitutions.json';
import { hasEmergingProviderProfile } from '@/app/components/emergingInstitutions/emergingProviderPageData';
import {
  buildEmergingProviderDetailHref,
  buildEmergingProviderDetailKeywords,
  buildEmergingProviderMetadata,
  buildEmergingProvidersDirectoryKeywords,
  listEmergingProviderNames,
  listEmergingProviderSlugsWithProfiles,
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
        qiltSourceHref:
          'https://www.compared.edu.au/institution/bond-university/undergraduate',
      }),
    );
    expect(provider?.heroInfoItems.length).toBeGreaterThan(0);
    expect(provider?.providerStats.length).toBeGreaterThan(0);
  });

  it('returns null for an unknown slug', () => {
    expect(resolveEmergingProviderForSlug('unknown-institute')).toBeNull();
  });

  it('resolves a doc-sourced emerging provider profile', () => {
    const provider = resolveEmergingProviderForSlug('deakin-university');
    expect(provider).toEqual(
      expect.objectContaining({
        slug: 'deakin-university',
        name: 'Deakin University',
      }),
    );
    expect(provider?.providerStats).toHaveLength(6);
  });
});

describe('emerging provider SEO keywords', () => {
  it('includes every listed institute name in directory keywords', () => {
    const keywords = buildEmergingProvidersDirectoryKeywords();
    const names = listEmergingProviderNames();

    expect(names.length).toBe(cardData.length);
    expect(keywords).toEqual(expect.arrayContaining(names));
    expect(keywords).toEqual(
      expect.arrayContaining([
        'NDA Emerging Providers',
        'Neurodiversity Academy',
        'Bond University',
        'Deakin University',
      ]),
    );
  });

  it('puts the provider name first in detail keywords and still lists all institutes', () => {
    const keywords = buildEmergingProviderDetailKeywords('Bond University');
    expect(keywords[0]).toBe('Bond University');
    expect(keywords).toEqual(expect.arrayContaining(listEmergingProviderNames()));
  });

  it('lists a static param slug for every profile-ready institute', () => {
    const slugs = listEmergingProviderSlugsWithProfiles();
    expect(slugs.length).toBe(cardData.length);
    expect(slugs).toContain('bond-university');
    expect(slugs).toContain('deakin-university');
  });
});

describe('buildEmergingProviderMetadata', () => {
  it('returns SEO metadata for a valid emerging provider', () => {
    const slug = 'griffith-university';
    const metadata = buildEmergingProviderMetadata(slug);
    const canonical = `${HOST_URL}/emergingproviders/${slug}`;

    expect(metadata).toEqual(
      expect.objectContaining({
        title: 'Griffith University | NDA Emerging Provider',
        description:
          'Explore student experience insights and neuro-inclusive profile for Griffith University.',
        keywords: expect.arrayContaining([
          'Griffith University',
          'NDA Emerging Provider',
          'Bond University',
        ]),
        alternates: { canonical },
        openGraph: {
          title: 'Griffith University | NDA Emerging Provider',
          description:
            'Explore student experience insights and neuro-inclusive profile for Griffith University.',
          url: canonical,
        },
      }),
    );
  });

  it('returns not-found metadata for an unknown slug', () => {
    expect(buildEmergingProviderMetadata('does-not-exist')).toEqual({ title: 'Not found' });
  });

  it('builds unique metadata for every institution with a profile page', () => {
    const profileReady = cardData.filter((institution) =>
      hasEmergingProviderProfile(slugify(institution.name)),
    );

    expect(profileReady.length).toBe(cardData.length);

    for (const { name } of profileReady) {
      const metadata = buildEmergingProviderMetadata(slugify(name));

      expect(metadata).toEqual(
        expect.objectContaining({
          title: `${name} | NDA Emerging Provider`,
          description: `Explore student experience insights and neuro-inclusive profile for ${name}.`,
          keywords: expect.arrayContaining([name, 'NDA Emerging Provider']),
        }),
      );
      expect(metadata.alternates?.canonical).toBe(`${HOST_URL}/emergingproviders/${slugify(name)}`);
    }
  });
});
