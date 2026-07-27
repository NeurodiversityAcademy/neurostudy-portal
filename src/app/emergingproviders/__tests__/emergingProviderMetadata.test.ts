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
        qiltSourceHref: 'https://www.compared.edu.au/institution/bond-university/undergraduate',
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
  it('includes only shared brand and topic terms in directory keywords', () => {
    const keywords = buildEmergingProvidersDirectoryKeywords();
    const names = listEmergingProviderNames();

    expect(names).toHaveLength(cardData.length);
    expect(keywords).toEqual([
      'NDA Emerging Providers',
      'NDA Emerging Provider',
      'Emerging Providers',
      'Neurodiversity Academy',
      'neuro-inclusive education',
      'neurodiversity',
    ]);
    for (const name of names) {
      expect(keywords).not.toContain(name);
    }
  });

  it('puts the provider name first in detail keywords with shared terms only', () => {
    const keywords = buildEmergingProviderDetailKeywords('Bond University');
    expect(keywords[0]).toBe('Bond University');
    expect(keywords).toEqual([
      'Bond University',
      'Bond University NDA',
      'Bond University Emerging Provider',
      'NDA Emerging Providers',
      'NDA Emerging Provider',
      'Emerging Providers',
      'Neurodiversity Academy',
      'neuro-inclusive education',
      'neurodiversity',
    ]);
    expect(keywords).not.toContain('Deakin University');
  });

  it('lists a static param slug for every profile-ready institute', () => {
    const slugs = listEmergingProviderSlugsWithProfiles();
    expect(slugs).toHaveLength(cardData.length);
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
          'Griffith University NDA',
          'NDA Emerging Provider',
          'Neurodiversity Academy',
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

    expect(profileReady).toHaveLength(cardData.length);

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
