import type { HeroInfoItem } from './EmergingProviderHero';
import type { ProviderStatItem } from './EmergingProviderStats';
import mapPin from '@/app/images/mapPin.svg';
import graduationCap from '@/app/images/graduationCap.png';
import challengeIcon from '@/app/images/challengeIcon.svg';
import clock from '@/app/images/clock.svg';
import goalIcon from '@/app/images/goalIcon.svg';
import strategyIcon from '@/app/images/strategyIcon.svg';
/* Emerging provider stat tiles — one asset per QILT area (src/app/images/emergingInstitutions/) */
import facilitiesIcon from '@/app/images/emergingInstitutions/facilities-icon.png';
import interactionsIcon from '@/app/images/emergingInstitutions/interactions-icon.png';
import skillIcon from '@/app/images/emergingInstitutions/skill-icon.png';
import supportServicesIcon from '@/app/images/emergingInstitutions/suport-services-icon.png';
import teachingQualityIcon from '@/app/images/emergingInstitutions/teaching-quality-icon.png';
import userExperienceIcon from '@/app/images/emergingInstitutions/user-experience-icon.png';

/** QILT areas in display order; each `icon` must stay aligned with `title`. */
const QILT_STAT_SECTIONS = [
  { title: 'Overall experience', icon: userExperienceIcon }, // user-experience-icon.png
  { title: 'Skills development', icon: skillIcon }, // skill-icon.png
  { title: 'Interactions with other students', icon: interactionsIcon }, // interactions-icon.png
  { title: 'Facilities & resources', icon: facilitiesIcon }, // facilities-icon.png
  { title: 'Teaching quality', icon: teachingQualityIcon }, // teaching-quality-icon.png
  { title: 'Support & services', icon: supportServicesIcon }, // suport-services-icon.png (filename spelling)
] as const;

type StatNumbers = Pick<
  ProviderStatItem,
  'value' | 'nationalAverage' | 'responses'
>;

const STAT_NUMBERS_BY_SLUG: Record<string, StatNumbers[]> = {
  'bond-university': [
    { value: '87.3%', nationalAverage: '78.6%', responses: '1,278' },
    { value: '91.0%', nationalAverage: '81.1%', responses: '1,219' },
    { value: '86.1%', nationalAverage: '73.1%', responses: '1,281' },
    { value: '93.0%', nationalAverage: '85.3%', responses: '1,226' },
    { value: '90.6%', nationalAverage: '80.5%', responses: '1,261' },
    { value: '90.6%', nationalAverage: '85.3%', responses: '1,035' },
  ],
  'australian-college-of-physical-education': [
    { value: '81.3%', nationalAverage: '78.6%', responses: '391' },
    { value: '87.5%', nationalAverage: '81.1%', responses: '376' },
    { value: '62.3%', nationalAverage: '73.1%', responses: '390' },
    { value: '87.4%', nationalAverage: '85.3%', responses: '354' },
    { value: '87.6%', nationalAverage: '80.5%', responses: '388' },
    { value: '84.3%', nationalAverage: '71.2%', responses: '313' },
  ],
  'flinders-university': [
    { value: '78.7%', nationalAverage: '78.6%', responses: '5,615' },
    { value: '83.3%', nationalAverage: '81.1%', responses: '5,423' },
    { value: '64.8%', nationalAverage: '73.1%', responses: '5,619' },
    { value: '85.7%', nationalAverage: '85.3%', responses: '5,071' },
    { value: '82.4%', nationalAverage: '80.5%', responses: '5,518' },
    { value: '75.4%', nationalAverage: '71.2%', responses: '3,638' },
  ],
  'griffith-university': [
    { value: '79.1%', nationalAverage: '78.6%', responses: '12,043' },
    { value: '82.2%', nationalAverage: '81.1%', responses: '11,615' },
    { value: '56.3%', nationalAverage: '73.1%', responses: '12,051' },
    { value: '83.8%', nationalAverage: '85.3%', responses: '10,564' },
    { value: '81.1%', nationalAverage: '80.5%', responses: '11,881' },
    { value: '72.7%', nationalAverage: '71.2%', responses: '8,350' },
  ],
  'jazz-music-institute': [
    { value: '97.7%', nationalAverage: '78.6%', responses: '43' },
    { value: '97.6%', nationalAverage: '81.1%', responses: '42' },
    { value: '88.4%', nationalAverage: '73.1%', responses: '43' },
    { value: '82.5%', nationalAverage: '85.3%', responses: '40' },
    { value: '97.6%', nationalAverage: '80.5%', responses: '42' },
    { value: '97.2%', nationalAverage: '71.2%', responses: '36' },
  ],
};

function buildStatsForSlug(slug: string): ProviderStatItem[] {
  const numbers = STAT_NUMBERS_BY_SLUG[slug];
  if (!numbers || numbers.length !== QILT_STAT_SECTIONS.length) {
    return [];
  }
  return QILT_STAT_SECTIONS.map((section, index) => ({
    icon: section.icon,
    title: section.title,
    ...numbers[index],
  }));
}

export const HERO_DETAILS_BY_SLUG: Record<string, HeroInfoItem[]> = {
  'bond-university': [
    { icon: mapPin, value: 'Gold Coast, QLD', label: 'Location' },
    { icon: graduationCap, value: 'Higher Education', label: 'Type' },
    { icon: challengeIcon, value: '2.5 Years', label: 'Duration' },
    { icon: clock, value: '10/31/2030', label: 'Application End' },
    { icon: goalIcon, value: '10', label: 'Subjects' },
    { icon: strategyIcon, value: '$7,990.00', label: 'Fees' },
  ],
  'australian-college-of-physical-education': [
    { icon: mapPin, value: 'Gold Coast, QLD', label: 'Location' },
    { icon: graduationCap, value: 'Higher Education', label: 'Type' },
    { icon: challengeIcon, value: '3 Years', label: 'Duration' },
    { icon: clock, value: '11/30/2030', label: 'Application End' },
    { icon: goalIcon, value: '12', label: 'Subjects' },
    { icon: strategyIcon, value: '$8,120.00', label: 'Fees' },
  ],
  'flinders-university': [
    { icon: mapPin, value: 'Gold Coast, QLD', label: 'Location' },
    { icon: graduationCap, value: 'Higher Education', label: 'Type' },
    { icon: challengeIcon, value: '2 Years', label: 'Duration' },
    { icon: clock, value: '09/30/2030', label: 'Application End' },
    { icon: goalIcon, value: '9', label: 'Subjects' },
    { icon: strategyIcon, value: '$7,200.00', label: 'Fees' },
  ],
  'griffith-university': [
    { icon: mapPin, value: 'Gold Coast, QLD', label: 'Location' },
    { icon: graduationCap, value: 'Higher Education', label: 'Type' },
    { icon: challengeIcon, value: '2.5 Years', label: 'Duration' },
    { icon: clock, value: '10/15/2030', label: 'Application End' },
    { icon: goalIcon, value: '10', label: 'Subjects' },
    { icon: strategyIcon, value: '$7,750.00', label: 'Fees' },
  ],
  'jazz-music-institute': [
    { icon: mapPin, value: 'Gold Coast, QLD', label: 'Location' },
    { icon: graduationCap, value: 'Higher Education', label: 'Type' },
    { icon: challengeIcon, value: '2 Years', label: 'Duration' },
    { icon: clock, value: '12/12/2030', label: 'Application End' },
    { icon: goalIcon, value: '8', label: 'Subjects' },
    { icon: strategyIcon, value: '$6,980.00', label: 'Fees' },
  ],
};

export const STATS_BY_SLUG: Record<string, ProviderStatItem[]> =
  Object.fromEntries(
    Object.keys(STAT_NUMBERS_BY_SLUG).map((slug) => [
      slug,
      buildStatsForSlug(slug),
    ])
  );
