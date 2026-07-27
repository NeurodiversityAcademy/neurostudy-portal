import docProfiles from './emergingProviderDocProfiles.json';

/** QILT stat tile count — must match `QILT_STAT_SECTIONS` in emergingProviderPageData. */
const QILT_STAT_SECTION_COUNT = 6;

interface DocProfileSlugEntry {
  slug: string;
  stats?: unknown[];
}

const DOC_PROFILE_SLUGS = (docProfiles as DocProfileSlugEntry[])
  .filter((profile) => profile.stats?.length === QILT_STAT_SECTION_COUNT)
  .map((profile) => profile.slug);

/** Slugs with a full detail page (hero + six QILT stats). */
export const EMERGING_PROVIDER_PROFILE_SLUGS: ReadonlySet<string> = new Set(DOC_PROFILE_SLUGS);

/** True when hero + QILT stats exist for a detail page (not just a directory listing). */
export function hasEmergingProviderProfile(slug: string): boolean {
  return EMERGING_PROVIDER_PROFILE_SLUGS.has(slug);
}
