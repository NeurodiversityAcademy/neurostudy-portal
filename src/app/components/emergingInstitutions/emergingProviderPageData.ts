import { HeroInfoItem } from './EmergingProviderHero';
import { ProviderStatItem } from './EmergingProviderStats';
import mapPin from '@/app/images/mapPin.svg';
import graduationCap from '@/app/images/graduationCap.png';
import challengeIcon from '@/app/images/challengeIcon.svg';
import clock from '@/app/images/clock.svg';
import goalIcon from '@/app/images/goalIcon.svg';
import strategyIcon from '@/app/images/strategyIcon.svg';
import star from '@/app/images/star.svg';
import valuesSupport from '@/app/images/valuesSupport.svg';
import valuesRespect from '@/app/images/valuesRespect.svg';
import valuesSafety from '@/app/images/valuesSafety.svg';
import emergingStatPlaceholder from '@/app/images/emergingStatPlaceholder.svg';

/** Replace `emergingStatPlaceholder.svg` when final Teaching quality / Support & services artwork exists. */
const TEACHING_QUALITY_AND_SUPPORT_STATS: ProviderStatItem[] = [
  {
    icon: emergingStatPlaceholder,
    value: '90.6%',
    title: 'Teaching quality',
    nationalAverage: '80.5%',
    responses: '1,261',
  },
  {
    icon: emergingStatPlaceholder,
    value: '90.6%',
    title: 'Support & services',
    nationalAverage: '85.3%',
    responses: '1,035',
  },
];

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

export const STATS_BY_SLUG: Record<string, ProviderStatItem[]> = {
  'bond-university': [
    {
      icon: star,
      value: '87.3%',
      title: 'Overall experience',
      nationalAverage: '78.6%',
      responses: '1,278',
    },
    {
      icon: goalIcon,
      value: '91.0%',
      title: 'Skills development',
      nationalAverage: '81.1%',
      responses: '1,219',
    },
    {
      icon: valuesSupport,
      value: '86.1%',
      title: 'Interactions with other students',
      nationalAverage: '73.1%',
      responses: '1,281',
    },
    {
      icon: valuesRespect,
      value: '93.0%',
      title: 'Facilities & resources',
      nationalAverage: '85.3%',
      responses: '1,226',
    },
    ...TEACHING_QUALITY_AND_SUPPORT_STATS,
  ],
  'australian-college-of-physical-education': [
    {
      icon: star,
      value: '85.6%',
      title: 'Overall experience',
      nationalAverage: '78.6%',
      responses: '1,102',
    },
    {
      icon: goalIcon,
      value: '90.2%',
      title: 'Skills development',
      nationalAverage: '81.1%',
      responses: '1,044',
    },
    {
      icon: valuesSupport,
      value: '83.8%',
      title: 'Interactions with other students',
      nationalAverage: '73.1%',
      responses: '1,117',
    },
    {
      icon: valuesSafety,
      value: '91.4%',
      title: 'Facilities & resources',
      nationalAverage: '85.3%',
      responses: '1,036',
    },
    ...TEACHING_QUALITY_AND_SUPPORT_STATS,
  ],
  'flinders-university': [
    {
      icon: star,
      value: '86.9%',
      title: 'Overall experience',
      nationalAverage: '78.6%',
      responses: '1,240',
    },
    {
      icon: goalIcon,
      value: '89.6%',
      title: 'Skills development',
      nationalAverage: '81.1%',
      responses: '1,184',
    },
    {
      icon: valuesSupport,
      value: '84.9%',
      title: 'Interactions with other students',
      nationalAverage: '73.1%',
      responses: '1,261',
    },
    {
      icon: valuesSafety,
      value: '92.1%',
      title: 'Facilities & resources',
      nationalAverage: '85.3%',
      responses: '1,208',
    },
    ...TEACHING_QUALITY_AND_SUPPORT_STATS,
  ],
  'griffith-university': [
    {
      icon: star,
      value: '88.1%',
      title: 'Overall experience',
      nationalAverage: '78.6%',
      responses: '1,314',
    },
    {
      icon: goalIcon,
      value: '92.0%',
      title: 'Skills development',
      nationalAverage: '81.1%',
      responses: '1,245',
    },
    {
      icon: valuesSupport,
      value: '85.7%',
      title: 'Interactions with other students',
      nationalAverage: '73.1%',
      responses: '1,292',
    },
    {
      icon: valuesSafety,
      value: '93.8%',
      title: 'Facilities & resources',
      nationalAverage: '85.3%',
      responses: '1,233',
    },
    ...TEACHING_QUALITY_AND_SUPPORT_STATS,
  ],
  'jazz-music-institute': [
    {
      icon: star,
      value: '84.7%',
      title: 'Overall experience',
      nationalAverage: '78.6%',
      responses: '612',
    },
    {
      icon: goalIcon,
      value: '88.4%',
      title: 'Skills development',
      nationalAverage: '81.1%',
      responses: '584',
    },
    {
      icon: valuesSupport,
      value: '82.9%',
      title: 'Interactions with other students',
      nationalAverage: '73.1%',
      responses: '621',
    },
    {
      icon: valuesSafety,
      value: '90.6%',
      title: 'Facilities & resources',
      nationalAverage: '85.3%',
      responses: '596',
    },
    ...TEACHING_QUALITY_AND_SUPPORT_STATS,
  ],
};
