import docProfiles from '../emergingProviderDocProfiles.json';
import {
  EMERGING_PROVIDER_PROFILE_SLUGS,
  hasEmergingProviderProfile,
} from '../emergingProviderProfileSlugs';

describe('emergingProviderProfileSlugs', () => {
  it('includes doc-sourced profile slugs', () => {
    expect(hasEmergingProviderProfile('bond-university')).toBe(true);
    expect(hasEmergingProviderProfile('deakin-university')).toBe(true);
    expect(hasEmergingProviderProfile('unknown-institute')).toBe(false);
  });

  it('matches doc profiles with six stats', () => {
    const docSlugs = (docProfiles as { slug: string; stats: unknown[] }[]).map(
      (profile) => profile.slug,
    );
    for (const slug of docSlugs) {
      expect(EMERGING_PROVIDER_PROFILE_SLUGS.has(slug)).toBe(true);
    }
  });

  it('treats slugs without full stats as not profile-ready', () => {
    expect(hasEmergingProviderProfile('')).toBe(false);
    expect(hasEmergingProviderProfile('not-a-provider')).toBe(false);
  });
});
