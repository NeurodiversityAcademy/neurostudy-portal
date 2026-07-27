import type { HeroInfoItem } from './InstitutionHero';
import type { ProviderStatItem } from './EmergingProviderStats';
import mapPin from '@/app/images/mapPin.svg';
import graduationCap from '@/app/images/graduationCap.png';
/* Emerging provider stat tiles — one asset per QILT area (src/app/images/emergingInstitutions/) */
import facilitiesIcon from '@/app/images/emergingInstitutions/facilities-icon.png';
import interactionsIcon from '@/app/images/emergingInstitutions/interactions-icon.png';
import skillIcon from '@/app/images/emergingInstitutions/skill-icon.png';
import supportServicesIcon from '@/app/images/emergingInstitutions/support-services-icon.png';
import teachingQualityIcon from '@/app/images/emergingInstitutions/teaching-quality-icon.png';
import userExperienceIcon from '@/app/images/emergingInstitutions/user-experience-icon.png';
import docProfiles from './emergingProviderDocProfiles.json';

/** QILT areas in display order; each `icon` must stay aligned with `title`. */
const QILT_STAT_SECTIONS = [
  { title: 'Overall experience', icon: userExperienceIcon }, // user-experience-icon.png
  { title: 'Skills development', icon: skillIcon }, // skill-icon.png
  { title: 'Interactions with other students', icon: interactionsIcon }, // interactions-icon.png
  { title: 'Facilities & resources', icon: facilitiesIcon }, // facilities-icon.png
  { title: 'Teaching quality', icon: teachingQualityIcon }, // teaching-quality-icon.png
  { title: 'Support & services', icon: supportServicesIcon }, // suport-services-icon.png (filename spelling)
] as const;

type StatNumbers = Pick<ProviderStatItem, 'value' | 'nationalAverage' | 'responses'>;

interface DocProfile {
  slug: string;
  heroLocation: string;
  heroType: string;
  stats: StatNumbers[];
}

const DOC_PROFILES = docProfiles as DocProfile[];

function buildStatsForSlug(stats: StatNumbers[]): ProviderStatItem[] {
  if (stats.length !== QILT_STAT_SECTIONS.length) {
    return [];
  }
  return QILT_STAT_SECTIONS.map((section, index) => ({
    icon: section.icon,
    title: section.title,
    ...stats[index],
  }));
}

export const HERO_DETAILS_BY_SLUG: Record<string, HeroInfoItem[]> = Object.fromEntries(
  DOC_PROFILES.map((profile) => [
    profile.slug,
    [
      { icon: mapPin, value: profile.heroLocation, label: 'Location' },
      { icon: graduationCap, value: profile.heroType, label: 'Type' },
    ],
  ]),
);

export const STATS_BY_SLUG: Record<string, ProviderStatItem[]> = Object.fromEntries(
  DOC_PROFILES.map((profile) => [profile.slug, buildStatsForSlug(profile.stats)]),
);

export { hasEmergingProviderProfile } from './emergingProviderProfileSlugs';
