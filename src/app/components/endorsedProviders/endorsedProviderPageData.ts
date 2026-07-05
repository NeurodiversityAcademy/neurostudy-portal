import type { StaticImageData } from 'next/image';
import type { HeroInfoItem } from '@/app/components/emergingInstitutions/InstitutionHero';
import type { ProviderStatItem } from '@/app/components/emergingInstitutions/EmergingProviderStats';
import mapPin from '@/app/images/mapPin.svg';
import graduationCap from '@/app/images/graduationCap.png';
import facilitiesIcon from '@/app/images/emergingInstitutions/facilities-icon.png';
import interactionsIcon from '@/app/images/emergingInstitutions/interactions-icon.png';
import skillIcon from '@/app/images/emergingInstitutions/skill-icon.png';
import supportServicesIcon from '@/app/images/emergingInstitutions/support-services-icon.png';
import teachingQualityIcon from '@/app/images/emergingInstitutions/teaching-quality-icon.png';
import userExperienceIcon from '@/app/images/emergingInstitutions/user-experience-icon.png';
import { slugify } from '@/app/utilities/common';
import { ENDORSED_PROVIDER_LOGO_BY_SLUG } from './endorsedProviderBrandAssets';
import endorsedData from './endorsedProviders.json';
import {
  VET_KEY_DATA_POINT_ICONS,
  type VetKeyDataPointIconKey,
} from './vetStatIcons';

export type EndorsedInstitutionType = 'higherEducation' | 'VET';

export type VetKeyDataPoint = {
  id: string;
  icon: StaticImageData;
  headline: string;
  title: string;
  description: string;
};

const QILT_STAT_SECTIONS = [
  { title: 'Overall experience', icon: userExperienceIcon },
  { title: 'Skills development', icon: skillIcon },
  { title: 'Teaching quality', icon: teachingQualityIcon },
  { title: 'Interactions with other students', icon: interactionsIcon },
  { title: 'Facilities & resources', icon: facilitiesIcon },
  { title: 'Support & services', icon: supportServicesIcon },
] as const;

type StatNumbers = Pick<
  ProviderStatItem,
  'value' | 'nationalAverage' | 'responses'
>;

/** Placeholder QILT-style stats per endorsed slug; replace with provider-specific data when available. */
const STAT_NUMBERS_BY_SLUG: Record<string, StatNumbers[]> = {
  collarts: [
    { value: '87.3%', nationalAverage: '78.6%', responses: '1278' },
    { value: '91.0%', nationalAverage: '81.1%', responses: '1219' },
    { value: '90.6%', nationalAverage: '80.5%', responses: '1261' },
    { value: '86.1%', nationalAverage: '73.1%', responses: '1281' },
    { value: '93.0%', nationalAverage: '85.3%', responses: '1226' },
    { value: '90.6%', nationalAverage: '86.4%', responses: '1035' },
  ],
};

type VetKeyDataPointContent = {
  id: string;
  iconKey: VetKeyDataPointIconKey;
  headline: string;
  title: string;
  description: string;
};

const VET_KEY_DATA_POINTS_CONTENT: VetKeyDataPointContent[] = [
  {
    id: 'vet-disability-prevalence',
    iconKey: 'disabilityPrevalence',
    headline: '4-5%',
    title: 'of VET students report having a disability',
    description: 'representing over 180,000 enrolments nationally.',
  },
  {
    id: 'vet-disability-young',
    iconKey: 'disabilityYoungStudents',
    headline: '5.4%',
    title: 'Report disability',
    description: 'Among VET students aged 15–24',
  },
  {
    id: 'vet-remote-regional',
    iconKey: 'remoteRegional',
    headline: '20%',
    title: 'of VET students in remote and regional',
    description:
      'Australia report having a disability, compared with around 6% of students in major cities.',
  },
  {
    id: 'vet-completion-rates',
    iconKey: 'completionRates',
    headline: '10-15%',
    title: 'lower completion rates are reported',
    description:
      'for students with disability compared with students without disability',
  },
  {
    id: 'vet-graduate-employment',
    iconKey: 'graduateEmployment',
    headline: '59%',
    title: 'of VET graduates with disability',
    description:
      'gain employment after training, compared with 79% without disability.',
  },
  {
    id: 'vet-neurodivergent-prevalence',
    iconKey: 'neurodivergentPrevalence',
    headline: '15-20%',
    title: 'of people are neurodivergent',
    description:
      'meaning the true number of neurodivergent VET students is likely higher than reported.',
  },
];

const VET_KEY_DATA_POINTS: VetKeyDataPoint[] = VET_KEY_DATA_POINTS_CONTENT.map(
  (point) => ({
    id: point.id,
    icon: VET_KEY_DATA_POINT_ICONS[point.iconKey],
    headline: point.headline,
    title: point.title,
    description: point.description,
  })
);

const INSTITUTION_TYPE_BY_SLUG: Record<string, EndorsedInstitutionType> = {
  hsh: 'VET',
  'blueprint-career-development': 'VET',
  academia: 'VET',
  collarts: 'higherEducation',
  'nepean-community-college': 'VET',
};

function buildQiltStatsForSlug(slug: string): ProviderStatItem[] {
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

function buildStatsForSlug(
  slug: string,
  institutionType: EndorsedInstitutionType
): ProviderStatItem[] {
  if (institutionType === 'VET') {
    return [];
  }
  return buildQiltStatsForSlug(slug);
}

export const HERO_INFO_LABEL_LOCATION = 'Location' as const;
export const HERO_INFO_LABEL_STUDY_MODE = 'Study Mode' as const;
export const HERO_INFO_LABEL_TYPE = 'Type' as const;

export function findHeroInfoValueByLabel(
  items: HeroInfoItem[],
  label: string
): string {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item.label === label) {
      return item.value;
    }
  }
  return '';
}

export const HERO_DETAILS_BY_SLUG: Record<string, HeroInfoItem[]> = {
  hsh: [
    {
      icon: mapPin,
      value: 'Perth, Subiaco, Bunbury, Murdoch University',
      label: 'Location',
    },
    {
      icon: graduationCap,
      value: 'Vocational Education & Training',
      label: 'Type',
    },
  ],
  academia: [
    { icon: mapPin, value: 'Brisbane', label: 'Location' },
    {
      icon: graduationCap,
      value: 'Online | Face-to-Face | Hybrid',
      label: 'Study Mode',
    },
    {
      icon: graduationCap,
      value: 'Vocational Education & Training Provider',
      label: 'Type',
    },
  ],
  'blueprint-career-development': [
    {
      icon: mapPin,
      value: 'Brisbane - Online | Face-to-Face | Hybrid',
      label: 'Location',
    },
    {
      icon: graduationCap,
      value: 'Vocational Education & Training',
      label: 'Type',
    },
  ],
  collarts: [
    {
      icon: mapPin,
      value: 'Melbourne, Sydney',
      label: 'Location',
    },
    {
      icon: graduationCap,
      value: 'Online | Face-to-Face | Hybrid',
      label: 'Study Mode',
    },
    {
      icon: graduationCap,
      value: 'Higher education',
      label: 'Type',
    },
  ],
  'nepean-community-college': [
    { icon: mapPin, value: 'Penrith, Sydney, NSW', label: 'Location' },
    {
      icon: graduationCap,
      value: 'Online | Face-to-Face | Hybrid',
      label: 'Study Mode',
    },
    {
      icon: graduationCap,
      value: 'Vocational Education & Training',
      label: 'Type',
    },
  ],
};

export type EndorsedIntroSection = {
  heading: string;
  body: string;
};

export type EndorsedFaqItem = {
  question: string;
  answer: string;
};

export type EndorsedFaqSection = {
  sectionTitle: string;
  items: EndorsedFaqItem[];
};

export const INTRO_SECTION_BY_SLUG: Record<string, EndorsedIntroSection> = {
  hsh: {
    heading: 'About the organisation',
    body: 'Health Science Hub is an Australian Registered Training Organisation (RTO #52806) delivering training focused on health, community services, and applied science, helping individuals build practical skills, career pathways, and employment outcomes. They specialise in health and wellbeing-related programs, offering industry-relevant training with a strong focus on practical application and real-world readiness, ensuring learners are well-prepared for further study or careers in the healthcare sector. See the results and insights from the endorsement assessment below.',
  },
  academia: {
    heading: 'About the Organisation',
    body: 'Academia is an Australian Registered Training Organisation (RTO #45593) delivering vocational education focused on building and construction, helping individuals develop practical skills, industry knowledge, and career outcomes. They specialise in construction-related qualifications, including Certificate III trades, higher-level qualifications, QBCC Site Supervisor courses, CPD training, and Recognition of Prior Learning (RPL). Their training is industry-aligned and designed to support learners in gaining the skills and credentials needed to succeed in the building and construction sector. See the results and insights from the endorsement assessment below.',
  },
  'blueprint-career-development': {
    heading: 'About this organisation',
    body: 'Blueprint Career Development is an Australian Registered Training Organisation (RTO #30978) delivering vocational education focused on practical skills, career pathways, and employment outcomes. They specialise in training and assessment (TAE), business, hospitality, and career development, offering nationally recognised qualifications with a strong focus on personalised, industry-relevant training that prepares learners for the workforce. See the results and insights from the endorsement assessment below.',
  },
  collarts: {
    heading: 'About this organisation',
    body: 'Collarts (Australian College of the Arts) is a specialist higher education provider based in Melbourne, Australia & Sydney, focused on creative industries and practical career pathways. The institution delivers industry-relevant degrees and courses across areas such as music, entertainment, fashion, digital media, and entrepreneurship. See the results and insights from the endorsement assessment below.',
  },
  'nepean-community-college': {
    heading: 'About the organisation',
    body: 'Nepean Community College is an Australian Registered Training Organisation (RTO #1223) delivering accessible, community-focused education across a range of vocational and foundation programs, supporting individuals to build practical skills, confidence, and pathways into further study, employment, and personal development. They focus on inclusive, flexible learning environments, offering industry-relevant training with a strong emphasis on real-world application and learner support, ensuring students are well-prepared for future opportunities. See the results and insights from the endorsement assessment below. See the results and insights from the endorsement assessment below.',
  },
};

export const ENDORSED_FAQ_SECTIONS_DEFAULT: EndorsedFaqSection[] = [
  {
    sectionTitle: 'About the Endorsement',
    items: [
      {
        question:
          'How does an organisation become endorsed by Neurodiversity Academy?',
        answer:
          'Organisations endorsed by Neurodiversity Academy undergo an endorsement assessment to verify their commitment to neuro-inclusive practices.',
      },
      {
        question: 'What criteria are used to assess neuro-inclusive practices?',
        answer:
          'Strong support from senior leadership is essential to ensure the right culture is in place before beginning a formal assessment.',
      },
      {
        question: 'Can organisations improve their endorsement over time?',
        answer:
          "Yes, absolutely. Endorsement is not about identifying the 'best' organisation. It recognises organisations committed to improving support for neurodivergent learners. While some may not initially meet every requirement, they can grow and strengthen their practices over time through student feedback and continuous improvement.",
      },
      {
        question: 'How often is endorsement reviewed?',
        answer:
          'Endorsement is reviewed every three months using student feedback. If concerns arise, an earlier review may take place to address issues and support improvement.',
      },
    ],
  },
  {
    sectionTitle: 'About the Platform',
    items: [
      {
        question: 'How can students use the platform to choose where to study?',
        answer:
          'Students can use the platform to explore the supports each organisation has in place and review past student ratings. The goal is to help neurodivergent students identify organisations that understand and provide the right supports for their learning journey.',
      },
      {
        question: 'Can parents or carers also provide feedback?',
        answer:
          'Yes, absolutely. We understand how important it is to find the right place for your child to study, so feedback from parents and carers is vital for the community.',
      },
      {
        question:
          'Are endorsed organisations required to maintain their standards?',
        answer:
          'Yes, this is vital. Regular feedback helps ensure endorsed organisations are delivering the supports they say they provide.',
      },
    ],
  },
  {
    sectionTitle: 'About Student Supports',
    items: [
      {
        question: 'What types of supports do endorsed organisations provide?',
        answer:
          'Endorsed organisations may offer a range of supports for neurodivergent students. As these supports can vary between organisations, we encourage students to review each organisation’s profile to see what is available.',
      },
      {
        question: 'Do all organisations offer the same supports?',
        answer:
          'Each organisation is unique and may offer different supports. Reviewing and comparing these can help you find the best fit for your needs.',
      },
      {
        question:
          'How do I request support or reasonable adjustments when studying?',
        answer:
          "If you require support or reasonable adjustments, contact the organisation's student support or support services team. They can discuss your learning needs and help arrange appropriate adjustments.",
      },
    ],
  },
  {
    sectionTitle: 'About Student Feedback',
    items: [
      {
        question:
          'What does “Neurodivergent Student Experience - Top 4 Areas of Strength” show?',
        answer:
          'This section combines student experience outcomes with feedback from neurodivergent learners (including student and parent/carer responses) to highlight where an organisation is currently performing strongly. The seven survey areas include overall experience, clear support information, effective adjustments, genuine institutional support, psychological safety, responsiveness to individual needs, and clear communication. The “Top 4 Areas of Strength” are the highest-performing areas from these results and provide a practical snapshot of where support is currently most consistent. Performance bands are interpreted as Low (below 60%), Medium (60-79%), and High (80%+), and all featured strengths meet the high-performance threshold.',
      },
      {
        question: 'How is student feedback used in the endorsement process?',
        answer:
          'Student feedback helps organisations maintain their endorsement by ensuring the student experience matches the supports offered and guiding continuous improvement.',
      },
      {
        question:
          'Can students share their experiences with endorsed organisations?',
        answer:
          'Yes, all feedback is shared with the organisation and is anonymous unless you choose to identify yourself.',
      },
      {
        question: 'How is student feedback collected and monitored?',
        answer:
          'Student feedback is collected through surveys distributed by the endorsed organisation. Neurodiversity Academy monitors the feedback and shares the results with the organisation.',
      },
    ],
  },
  {
    sectionTitle: 'Important Questions',
    items: [
      {
        question: 'Is endorsement a guarantee that an organisation is perfect?',
        answer:
          'No. While we aim for every student to have a positive experience, we cannot guarantee that it will always be perfect.',
      },
      {
        question:
          'What happens if an organisation stops meeting endorsement standards?',
        answer:
          'If an organisation no longer meets endorsement standards, their endorsement may be reviewed or removed.',
      },
    ],
  },
];

export const ENDORSED_FAQ_SECTIONS_BY_SLUG: Record<
  string,
  EndorsedFaqSection[]
> = {};

export type EndorsedNdExperience = {
  heading: string;
  summary: string;
  surveyAreas: string[];
  contextNote: string;
  responseSummary: string;
  methodology?: string;
  performanceBands?: {
    low: string;
    medium: string;
    high: string;
  };
};

export type TopStrengthIconKind =
  | 'supportInformation'
  | 'adjustments'
  | 'overallExperience'
  | 'communication';

export type TopStrengthArea = {
  title: string;
  iconKind: TopStrengthIconKind;
  description?: string;
  scoreBand?: 'Low' | 'Medium' | 'High';
};

export type StaffNomination = {
  name: string;
  role: string;
  nominations: number;
};

export type SupportFrameworkItem = {
  label: string;
  status: 'Supports in place' | 'In the works';
};

export type SupportFrameworkSection = {
  section: string;
  items: SupportFrameworkItem[];
};

const ENDORSED_SURVEY_AREAS = [
  'Overall experience',
  'Clear information about support options',
  'Adjustments implemented effectively',
  'Organisation genuinely supports neurodivergent students',
  'Feel safe being open about learning needs',
  "Organisation takes the learner's individual needs seriously",
  'Communication is clear and responsive',
] as const;

const DEFAULT_PERFORMANCE_BANDS: EndorsedNdExperience['performanceBands'] = {
  low: 'Low — below 60%',
  medium: 'Medium — 60–79%',
  high: 'High — 80%+',
};

const DEFAULT_RESPONSE_SUMMARY =
  'Based on 5 total survey responses from students and parents collected over a three-month period.';

const VET_ND_EXPERIENCE: EndorsedNdExperience = {
  heading: 'Neurodivergent Student Experience - Top 4 Areas of Strength',
  summary:
    'With higher education, endorsement insights are informed by student surveys such as QILT, conducted by the Australian Government and neurodivergent student feedback. As vocational education does not currently have an equivalent national report, Neurodiversity Academy collects independent student feedback to help organisations maintain their endorsement, monitor student experiences, and identify areas for improvement. See how this organisation is performing below.',
  surveyAreas: [...ENDORSED_SURVEY_AREAS],
  contextNote:
    'This information supports continuous improvement and ongoing Neuroinclusion Endorsement. Below, we have shared the top four areas of strength based on these results. All areas shown below meet the High performance threshold.',
  responseSummary: DEFAULT_RESPONSE_SUMMARY,
  performanceBands: DEFAULT_PERFORMANCE_BANDS,
};

const COLLARTS_ND_EXPERIENCE: EndorsedNdExperience = {
  heading: 'Neurodivergent Student Experience - Top 4 Areas of Strength',
  summary:
    'Higher education providers publish data on student experience and outcomes, including the national QILT (Quality Indicators for Learning and Teaching) Student Experience Survey. This profile combines QILT data with feedback from neurodivergent learners, including both student and parent/carer responses, to provide insight into the learning environment and support provided.',
  surveyAreas: [...ENDORSED_SURVEY_AREAS],
  contextNote:
    'This information supports continuous improvement and ongoing Neuroinclusion Endorsement. Below, we have shared the top four areas of strength based on these results. All areas shown below meet the high performance threshold.',
  responseSummary: DEFAULT_RESPONSE_SUMMARY,
  performanceBands: DEFAULT_PERFORMANCE_BANDS,
};

const COLLARTS_TOP_STRENGTH_AREAS: TopStrengthArea[] = [
  {
    title: 'Clear information about support options',
    iconKind: 'supportInformation',
    scoreBand: 'High',
  },
  {
    title: 'Overall experience',
    iconKind: 'overallExperience',
    scoreBand: 'High',
  },
  {
    title: 'Adjustments implemented effectively',
    iconKind: 'adjustments',
    scoreBand: 'High',
  },
  {
    title: 'Communication is clear and responsive',
    iconKind: 'communication',
    scoreBand: 'High',
  },
];

const DEFAULT_TOP_STRENGTH_AREAS: TopStrengthArea[] = [
  {
    title: 'Clear information about support options',
    iconKind: 'supportInformation',
    scoreBand: 'High',
  },
  {
    title: 'Adjustments implemented effectively',
    iconKind: 'adjustments',
    scoreBand: 'High',
  },
  {
    title: 'Overall experience',
    iconKind: 'overallExperience',
    scoreBand: 'High',
  },
  {
    title: 'Communication is clear and responsive',
    iconKind: 'communication',
    scoreBand: 'High',
  },
];

export const ENDORSED_ND_EXPERIENCE_BY_SLUG: Record<
  string,
  EndorsedNdExperience
> = {
  hsh: VET_ND_EXPERIENCE,
  academia: VET_ND_EXPERIENCE,
  'blueprint-career-development': VET_ND_EXPERIENCE,
  collarts: COLLARTS_ND_EXPERIENCE,
  'nepean-community-college': VET_ND_EXPERIENCE,
};

export const TOP_STRENGTH_AREAS_BY_SLUG: Record<string, TopStrengthArea[]> = {
  hsh: DEFAULT_TOP_STRENGTH_AREAS,
  academia: COLLARTS_TOP_STRENGTH_AREAS,
  'blueprint-career-development': DEFAULT_TOP_STRENGTH_AREAS,
  collarts: COLLARTS_TOP_STRENGTH_AREAS,
  'nepean-community-college': DEFAULT_TOP_STRENGTH_AREAS,
};

export const STUDY_AREAS_BY_SLUG: Record<string, string[]> = {
  hsh: [
    'Nursing',
    'Medic / Emergency Response',
    'Allied Health',
    'Caring for Others (Community Services)',
    'World Health (Public Health & Global Health)',
    'Fitness, Sport & Nutrition',
    'Animal, Marine & Environmental Studies',
    'Digital Technology',
    'Laboratory & Forensic Science',
    'Education (Teaching & Learning Pathways)',
  ],
  academia: [
    'Construction Safety (White Card / WHS)',
    'Carpentry (Certificate III)',
    'Building & Construction Management (Advanced Diploma)',
    'Site Supervision (QBCC Open Site Supervisor)',
    'Continuing Professional Development (CPD) Courses',
  ],
  collarts: [
    'Music & Audio',
    'Film, Theatre & Performing Arts',
    'Games & Animation',
    'Design & Visual Arts',
    'Fashion',
    'Media & Communication',
    'Creative Business & Management',
  ],
  'blueprint-career-development': [
    'Training & Assessment (TAE)',
    'Business & Workplace Skills',
    'Hospitality',
    'Tourism',
    'Career Development',
    'Volunteering',
    'Sport & Recreation / Coaching',
    'Personal Development & Empowerment',
  ],
  'nepean-community-college': [
    'Accredited Qualifications',
    'Foundation Skills',
    'Digital Skills',
    'Creative Arts & Crafts',
    'Creative Writing',
    'Health & Wellbeing',
    'Life Skills',
    'Languages (Multilingual Life)',
    'One-Day Workshops',
    'Government-Funded Training Programs',
  ],
};

export const STAFF_NOMINATIONS_BY_SLUG: Record<string, StaffNomination[]> = {
  hsh: [
    { name: 'Name', role: 'Job title · slot 1', nominations: 0 },
    { name: 'Name', role: 'Job title · slot 2', nominations: 0 },
    { name: 'Name', role: 'Job title · slot 3', nominations: 0 },
    { name: 'Name', role: 'Job title · slot 4', nominations: 0 },
  ],
  collarts: [
    {
      name: 'Support Team Member 1',
      role: 'Student Support',
      nominations: 0,
    },
    {
      name: 'Support Team Member 2',
      role: 'Learning Support',
      nominations: 0,
    },
  ],
};

export const SUPPORT_FRAMEWORK_BY_SLUG: Record<
  string,
  SupportFrameworkSection[]
> = {
  hsh: [
    {
      section: 'Staff Training',
      items: [
        { label: 'NDA-approved training', status: 'In the works' },
        { label: 'External neurodiversity training', status: 'In the works' },
        { label: 'Whole-org training (2 years)', status: 'In the works' },
        { label: 'Ongoing PD structured', status: 'In the works' },
      ],
    },
    {
      section: 'Support Staff',
      items: [
        {
          label: 'Designated ND support person',
          status: 'Supports in place',
        },
        {
          label: 'Support person listed publicly',
          status: 'Supports in place',
        },
        { label: 'Support staff training', status: 'Supports in place' },
        { label: 'Lived experience of ND', status: 'Supports in place' },
        { label: 'Peer support / student networks', status: 'In the works' },
      ],
    },
    {
      section: 'Pre-Enrolment & Disclosure',
      items: [
        {
          label: 'Accessibility discussed pre-enrolment',
          status: 'In the works',
        },
        {
          label: 'Process for undiagnosed students',
          status: 'Supports in place',
        },
        {
          label: 'School transition support',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Student Support',
      items: [
        { label: 'Individualised support plans', status: 'Supports in place' },
        { label: 'Support plans co-created', status: 'Supports in place' },
        {
          label: 'Teaching staff involved in plans',
          status: 'Supports in place',
        },
        { label: 'Regular check-in sessions', status: 'Supports in place' },
        {
          label: 'Academic literacy/LLN for ND needs',
          status: 'Supports in place',
        },
        {
          label: 'Digital literacy / exec function',
          status: 'Supports in place',
        },
        {
          label: 'ND-specific support services',
          status: 'Supports in place',
        },
        { label: 'Referral pathways', status: 'Supports in place' },
        {
          label: 'Pre-course teacher connection',
          status: 'Supports in place',
        },
        {
          label: 'Admin navigation support',
          status: 'Supports in place',
        },
        {
          label: 'Documentation of support needs',
          status: 'Supports in place',
        },
        { label: 'Career guidance tailored', status: 'In the works' },
        { label: 'Teaching staff resources', status: 'In the works' },
      ],
    },
    {
      section: 'Website & Digital Accessibility',
      items: [
        { label: 'ND support info easy to find', status: 'Supports in place' },
        {
          label: 'Website tested by ND users',
          status: 'Supports in place',
        },
        {
          label: 'Enrolment process accessible',
          status: 'Supports in place',
        },
        {
          label: 'Website accessibility features',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Assistive Technology',
      items: [
        {
          label: 'Instructional videos/LMS guides',
          status: 'Supports in place',
        },
        {
          label: 'Assistive technologies available',
          status: 'In the works',
        },
        { label: 'Ongoing AT support', status: 'In the works' },
      ],
    },
    {
      section: 'Assessment',
      items: [
        {
          label: 'Flexible assessment options',
          status: 'Supports in place',
        },
        {
          label: 'Reasonable adjustments policy',
          status: 'Supports in place',
        },
        {
          label: 'Layout examples/mock assessments',
          status: 'Supports in place',
        },
      ],
    },
    {
      section: 'Learning Design & Delivery',
      items: [
        {
          label: 'Learning materials in multiple formats',
          status: 'Supports in place',
        },
        {
          label: 'Students can adjust playback speed',
          status: 'Supports in place',
        },
        {
          label: 'Absence alternatives available',
          status: 'Supports in place',
        },
        { label: 'UDL principles embedded', status: 'In the works' },
      ],
    },
    {
      section: 'Campus',
      items: [
        { label: 'Minimise sensory triggers', status: 'Supports in place' },
        { label: 'Quiet zones communicated', status: 'Supports in place' },
        { label: 'Orientation/campus visits', status: 'Supports in place' },
        {
          label: 'Visual navigation guides',
          status: 'Supports in place',
        },
        { label: 'Sensory-friendly areas', status: 'In the works' },
        { label: 'ND consultation on spaces', status: 'In the works' },
        {
          label: 'Sensory challenge policies',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Policy & Compliance',
      items: [
        {
          label: 'Standalone neuroinclusion policy',
          status: 'In the works',
        },
      ],
    },
  ],
  academia: [
    {
      section: 'Staff Training',
      items: [
        { label: 'NDA-approved training', status: 'In the works' },
        {
          label: 'External neurodiversity training',
          status: 'In the works',
        },
        {
          label: 'Designated neuroinclusion champion',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Support Staff',
      items: [
        {
          label: 'Designated ND support person',
          status: 'Supports in place',
        },
        {
          label: 'Support person listed publicly',
          status: 'Supports in place',
        },
        { label: 'Support staff training', status: 'Supports in place' },
      ],
    },
    {
      section: 'Pre-Enrolment & Disclosure',
      items: [
        {
          label: 'Accessibility discussed pre-enrolment',
          status: 'Supports in place',
        },
        {
          label: 'Process for undiagnosed students',
          status: 'Supports in place',
        },
        {
          label: 'Accessibility discussed pre-enrolment',
          status: 'In the works',
        },
        {
          label: 'School transition support',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Student Support',
      items: [
        { label: 'Support plans co-created', status: 'Supports in place' },
        {
          label: 'Teaching staff involved in plans',
          status: 'Supports in place',
        },
        { label: 'Referral pathways', status: 'Supports in place' },
        { label: 'Career guidance tailored', status: 'Supports in place' },
        {
          label: 'Pre-course teacher connection',
          status: 'Supports in place',
        },
        {
          label: 'Admin navigation support',
          status: 'Supports in place',
        },
        {
          label: 'Individualised support plans',
          status: 'In the works',
        },
        {
          label: 'Regular check-in sessions',
          status: 'In the works',
        },
        {
          label: 'Academic literacy/LLN for ND needs',
          status: 'In the works',
        },
        {
          label: 'Digital literacy / exec function',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Website & Digital Accessibility',
      items: [
        {
          label: 'Enrolment process accessible',
          status: 'Supports in place',
        },
      ],
    },
    {
      section: 'Assistive Technology',
      items: [
        {
          label: 'Assistive technologies available',
          status: 'In the works',
        },
        { label: 'LMS compatible with AT', status: 'In the works' },
        { label: 'Ongoing AT support', status: 'In the works' },
        {
          label: 'Instructional videos/LMS guides',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Assessment',
      items: [
        {
          label: 'Flexible assessment options',
          status: 'Supports in place',
        },
        {
          label: 'Reasonable adjustments policy',
          status: 'Supports in place',
        },
      ],
    },
    {
      section: 'Learning Design & Delivery',
      items: [
        { label: 'UDL principles embedded', status: 'In the works' },
        {
          label: 'Learning materials in multiple formats',
          status: 'In the works',
        },
        {
          label: 'Absence alternatives available',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Campus',
      items: [
        { label: 'Quiet zones communicated', status: 'Supports in place' },
        { label: 'Sensory-friendly areas', status: 'In the works' },
        { label: 'Sensory challenge policies', status: 'In the works' },
        { label: 'Minimise sensory triggers', status: 'In the works' },
      ],
    },
    {
      section: 'Policy & Compliance',
      items: [
        {
          label: 'Harassment/discrimination policies',
          status: 'Supports in place',
        },
        {
          label: 'Complaints/appeals process',
          status: 'Supports in place',
        },
        { label: 'Formal review cycle', status: 'Supports in place' },
        {
          label: 'Standalone neuroinclusion policy',
          status: 'In the works',
        },
        {
          label: 'Track outcomes for ND students',
          status: 'In the works',
        },
      ],
    },
  ],
  'blueprint-career-development': [
    {
      section: 'Staff Training',
      items: [
        {
          label: 'External neurodiversity training',
          status: 'Supports in place',
        },
        { label: 'Ongoing PD structured', status: 'Supports in place' },
        { label: 'NDA-approved training', status: 'In the works' },
        { label: 'Whole-org training (2 years)', status: 'In the works' },
        {
          label: 'Designated neuroinclusion champion',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Support Staff',
      items: [
        { label: 'Support staff training', status: 'Supports in place' },
        {
          label: 'Peer support / student networks',
          status: 'Supports in place',
        },
        {
          label: 'Designated ND support person',
          status: 'In the works',
        },
        { label: 'Lived experience of ND', status: 'In the works' },
      ],
    },
    {
      section: 'Pre-Enrolment & Disclosure',
      items: [
        {
          label: 'Accessibility discussed pre-enrolment',
          status: 'Supports in place',
        },
        {
          label: 'Process for undiagnosed students',
          status: 'Supports in place',
        },
        {
          label: 'Accessibility discussed pre-enrolment',
          status: 'In the works',
        },
        {
          label: 'School transition support',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Student Support',
      items: [
        {
          label: 'Teaching staff involved in plans',
          status: 'Supports in place',
        },
        { label: 'Regular check-in sessions', status: 'Supports in place' },
        {
          label: 'Academic literacy/LLN for ND needs',
          status: 'Supports in place',
        },
        {
          label: 'Digital literacy / exec function',
          status: 'Supports in place',
        },
        {
          label: 'ND-specific support services',
          status: 'Supports in place',
        },
        { label: 'Referral pathways', status: 'Supports in place' },
        { label: 'Career guidance tailored', status: 'Supports in place' },
        { label: 'Teaching staff resources', status: 'Supports in place' },
        { label: 'Admin navigation support', status: 'Supports in place' },
        {
          label: 'Documentation of support needs',
          status: 'Supports in place',
        },
        { label: 'Support plans co-created', status: 'In the works' },
        {
          label: 'Pre-course teacher connection',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Website & Digital Accessibility',
      items: [
        {
          label: 'Website accessibility features',
          status: 'Supports in place',
        },
        {
          label: 'ND support info easy to find',
          status: 'In the works',
        },
        {
          label: 'Enrolment process accessible',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Assistive Technology',
      items: [
        {
          label: 'Assistive technologies available',
          status: 'Supports in place',
        },
        {
          label: 'Instructional videos/LMS guides',
          status: 'Supports in place',
        },
        { label: 'Ongoing AT support', status: 'In the works' },
      ],
    },
    {
      section: 'Assessment',
      items: [
        {
          label: 'Flexible assessment options',
          status: 'Supports in place',
        },
        {
          label: 'Reasonable adjustments policy',
          status: 'Supports in place',
        },
        {
          label: 'Layout examples/mock assessments',
          status: 'Supports in place',
        },
      ],
    },
    {
      section: 'Learning Design & Delivery',
      items: [
        {
          label: 'Learning materials in multiple formats',
          status: 'Supports in place',
        },
        {
          label: 'Students can adjust playback speed',
          status: 'Supports in place',
        },
        {
          label: 'Absence alternatives available',
          status: 'Supports in place',
        },
        { label: 'UDL principles embedded', status: 'In the works' },
      ],
    },
    {
      section: 'Campus',
      items: [
        { label: 'Orientation/campus visits', status: 'Supports in place' },
        { label: 'Sensory-friendly areas', status: 'In the works' },
        { label: 'Minimise sensory triggers', status: 'In the works' },
        { label: 'Quiet zones communicated', status: 'In the works' },
      ],
    },
    {
      section: 'Policy & Compliance',
      items: [
        {
          label: 'Harassment/discrimination policies',
          status: 'In the works',
        },
        { label: 'Complaints/appeals process', status: 'In the works' },
        { label: 'Formal review cycle', status: 'In the works' },
      ],
    },
  ],
  collarts: [
    {
      section: 'Staff Training',
      items: [
        {
          label: 'Designated neuroinclusion champion',
          status: 'Supports in place',
        },
        {
          label: 'External neurodiversity training',
          status: 'In the works',
        },
        {
          label: 'Whole-org training (2 years)',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Support Staff',
      items: [
        {
          label: 'Support person listed publicly',
          status: 'Supports in place',
        },
        {
          label: 'Support staff training',
          status: 'Supports in place',
        },
        {
          label: 'Lived experience of ND',
          status: 'Supports in place',
        },
        {
          label: 'Designated ND support person',
          status: 'In the works',
        },
        {
          label: 'Peer support / student networks',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Pre-Enrolment & Disclosure',
      items: [
        {
          label: 'Accessibility discussed pre-enrolment',
          status: 'In the works',
        },
        {
          label: 'School transition support',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Student Support',
      items: [
        {
          label: 'Individualised support plans',
          status: 'Supports in place',
        },
        {
          label: 'Support plans co-created',
          status: 'Supports in place',
        },
        {
          label: 'Regular check-in sessions',
          status: 'Supports in place',
        },
        {
          label: 'Academic literacy/LLND',
          status: 'Supports in place',
        },
        {
          label: 'ND-specific support services',
          status: 'Supports in place',
        },
        {
          label: 'Career guidance tailored',
          status: 'Supports in place',
        },
        {
          label: 'Pre-course teacher connection',
          status: 'Supports in place',
        },
        {
          label: 'Digital literacy / exec function',
          status: 'In the works',
        },
        {
          label: 'Referral pathways',
          status: 'In the works',
        },
        {
          label: 'Teaching staff resources',
          status: 'In the works',
        },
        {
          label: 'Admin navigation support',
          status: 'In the works',
        },
        {
          label: 'Documentation of support needs',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Website & Digital Accessibility',
      items: [
        {
          label: 'Enrolment process accessible',
          status: 'Supports in place',
        },
        {
          label: 'ND support info easy to find',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Assistive Technology',
      items: [
        {
          label: 'Assistive technologies available',
          status: 'Supports in place',
        },
        {
          label: 'LMS compatible with AT',
          status: 'Supports in place',
        },
        {
          label: 'Ongoing AT support',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Assessment',
      items: [
        {
          label: 'Flexible assessment options',
          status: 'Supports in place',
        },
        {
          label: 'Reasonable adjustments policy',
          status: 'Supports in place',
        },
      ],
    },
    {
      section: 'Learning Design & Delivery',
      items: [
        {
          label: 'Learning materials in multiple formats',
          status: 'Supports in place',
        },
        {
          label: 'Live sessions recorded and uploaded',
          status: 'Supports in place',
        },
        {
          label: 'Students can adjust playback speed',
          status: 'Supports in place',
        },
        {
          label: 'UDL principles embedded',
          status: 'In the works',
        },
        {
          label: 'Lectures pre-recorded and available',
          status: 'In the works',
        },
        {
          label: 'Absence alternatives available',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Campus',
      items: [
        {
          label: 'Orientation/campus visits',
          status: 'Supports in place',
        },
        {
          label: 'Sensory-friendly areas',
          status: 'In the works',
        },
        {
          label: 'Sensory challenge policies',
          status: 'In the works',
        },
        {
          label: 'Minimise sensory triggers',
          status: 'In the works',
        },
        {
          label: 'Quiet zones communicated',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Policy & Compliance',
      items: [
        {
          label: 'Harassment/discrimination policies',
          status: 'Supports in place',
        },
        {
          label: 'Complaints/appeals process',
          status: 'Supports in place',
        },
        {
          label: 'Formal review cycle',
          status: 'Supports in place',
        },
        {
          label: 'Standalone neuroinclusion policy',
          status: 'In the works',
        },
        {
          label: 'Track outcomes for ND students',
          status: 'In the works',
        },
      ],
    },
  ],
  'nepean-community-college': [
    {
      section: 'Staff Training',
      items: [
        { label: 'NDA-approved training', status: 'Supports in place' },
        {
          label: 'External neurodiversity training',
          status: 'Supports in place',
        },
        {
          label: 'Designated neuroinclusion champion',
          status: 'Supports in place',
        },
        { label: 'Ongoing PD structured', status: 'Supports in place' },
        { label: 'Whole-org training (2 years)', status: 'In the works' },
      ],
    },
    {
      section: 'Support Staff',
      items: [
        {
          label: 'Designated ND support person',
          status: 'Supports in place',
        },
        { label: 'Support staff training', status: 'Supports in place' },
        { label: 'Lived experience of ND', status: 'Supports in place' },
        {
          label: 'Peer support / student networks',
          status: 'Supports in place',
        },
        {
          label: 'Support person listed publicly',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Pre-Enrolment & Disclosure',
      items: [
        {
          label: 'Accessibility discussed pre-enrolment',
          status: 'Supports in place',
        },
        {
          label: 'Process for undiagnosed students',
          status: 'Supports in place',
        },
        { label: 'School transition support', status: 'Supports in place' },
      ],
    },
    {
      section: 'Student Support',
      items: [
        {
          label: 'Individualised support plans',
          status: 'Supports in place',
        },
        { label: 'Support plans co-created', status: 'Supports in place' },
        {
          label: 'Teaching staff involved in plans',
          status: 'Supports in place',
        },
        { label: 'Regular check-in sessions', status: 'Supports in place' },
        {
          label: 'Academic literacy/LLN for ND needs',
          status: 'Supports in place',
        },
        {
          label: 'Digital literacy / exec function',
          status: 'Supports in place',
        },
        {
          label: 'ND-specific support services',
          status: 'Supports in place',
        },
        { label: 'Referral pathways', status: 'Supports in place' },
        {
          label: 'Pre-course teacher connection',
          status: 'Supports in place',
        },
        { label: 'Admin navigation support', status: 'Supports in place' },
        {
          label: 'Documentation of support needs',
          status: 'Supports in place',
        },
        { label: 'Career guidance tailored', status: 'Supports in place' },
        { label: 'Teaching staff resources', status: 'Supports in place' },
      ],
    },
    {
      section: 'Website & Digital Accessibility',
      items: [
        {
          label: 'Enrolment process accessible',
          status: 'Supports in place',
        },
        {
          label: 'Website accessibility features',
          status: 'In the works',
        },
        { label: 'ND support info easy to find', status: 'In the works' },
        { label: 'Website tested by ND users', status: 'In the works' },
      ],
    },
    {
      section: 'Assistive Technology',
      items: [
        {
          label: 'Assistive technologies available',
          status: 'Supports in place',
        },
        {
          label: 'Instructional videos/LMS guides',
          status: 'Supports in place',
        },
        { label: 'LMS compatible with AT', status: 'In the works' },
      ],
    },
    {
      section: 'Assessment',
      items: [
        {
          label: 'Flexible assessment options',
          status: 'Supports in place',
        },
        {
          label: 'Reasonable adjustments policy',
          status: 'Supports in place',
        },
        {
          label: 'Layout examples/mock assessments',
          status: 'Supports in place',
        },
      ],
    },
    {
      section: 'Learning Design & Delivery',
      items: [
        {
          label: 'Learning materials in multiple formats',
          status: 'Supports in place',
        },
        {
          label: 'Students can adjust playback speed',
          status: 'Supports in place',
        },
        {
          label: 'Absence alternatives available',
          status: 'Supports in place',
        },
        { label: 'UDL principles embedded', status: 'In the works' },
        {
          label: 'Lectures pre-recorded and available',
          status: 'In the works',
        },
      ],
    },
    {
      section: 'Campus',
      items: [
        { label: 'Sensory-friendly areas', status: 'Supports in place' },
        { label: 'ND consultation on spaces', status: 'Supports in place' },
        { label: 'Minimise sensory triggers', status: 'Supports in place' },
        { label: 'Quiet zones communicated', status: 'Supports in place' },
        { label: 'Orientation/campus visits', status: 'Supports in place' },
        {
          label: 'Visual navigation guides',
          status: 'Supports in place',
        },
      ],
    },
    {
      section: 'Policy & Compliance',
      items: [
        {
          label: 'Harassment/discrimination policies',
          status: 'Supports in place',
        },
        {
          label: 'Complaints/appeals process',
          status: 'Supports in place',
        },
        { label: 'Formal review cycle', status: 'Supports in place' },
        {
          label: 'Track outcomes for ND students',
          status: 'Supports in place',
        },
      ],
    },
  ],
};

type EndorsedJsonRow = {
  id: string;
  logo?: string;
  /** Large institution mark beside the endorsed badge in the meta strip; falls back to `logo`. */
  metaStripInstitutionIconSrc?: string;
  topBackgroundImage?: string;
  institutionCoursesUrl: string;
};

const rows = endorsedData as EndorsedJsonRow[];

const INSTITUTION_COURSES_URL_BY_SLUG: Record<string, string> =
  Object.fromEntries(
    rows.map((row) => [slugify(row.id), row.institutionCoursesUrl.trim()])
  );

const META_STRIP_INSTITUTION_ICON_BY_SLUG: Record<string, string> =
  Object.fromEntries(
    rows
      .map((row) => {
        const slug = slugify(row.id);
        const explicit = row.metaStripInstitutionIconSrc?.trim();
        const fallback = row.logo?.trim();
        const src = explicit || fallback || '';
        return [slug, src];
      })
      .filter(([, src]) => src.length > 0)
  );

/** Slugs derived the same way as future home card links: `slugify(provider.id)`. */
export const ENDORSED_SLUGS: readonly string[] = rows.map((row) =>
  slugify(row.id)
);

export function getInstitutionTypeForSlug(
  slug: string
): EndorsedInstitutionType {
  return INSTITUTION_TYPE_BY_SLUG[slug] ?? 'higherEducation';
}

export const STATS_BY_SLUG: Record<string, ProviderStatItem[]> =
  Object.fromEntries(
    ENDORSED_SLUGS.map((slug) => [
      slug,
      buildStatsForSlug(slug, getInstitutionTypeForSlug(slug)),
    ])
  );

export function getVetKeyDataPointsForSlug(slug: string): VetKeyDataPoint[] {
  if (getInstitutionTypeForSlug(slug) !== 'VET') {
    return [];
  }
  return VET_KEY_DATA_POINTS;
}

export function hasEndorsedDeliverySignals(slug: string): boolean {
  const institutionType = getInstitutionTypeForSlug(slug);
  if (institutionType === 'VET') {
    return VET_KEY_DATA_POINTS.length > 0;
  }
  return (STATS_BY_SLUG[slug]?.length ?? 0) > 0;
}

function displayNameForEndorsedId(id: string): string {
  if (id === 'academia') {
    return 'Academia';
  }
  if (id === 'HSH') {
    return 'Health Science Hub';
  }
  return id;
}

const DISPLAY_NAME_BY_SLUG: Record<string, string> = Object.fromEntries(
  rows.map((row) => [slugify(row.id), displayNameForEndorsedId(row.id)])
);

export function getEndorsedDisplayNameForSlug(
  slug: string
): string | undefined {
  return DISPLAY_NAME_BY_SLUG[slug];
}

export function getEndorsedFaqSectionsForSlug(
  slug: string
): EndorsedFaqSection[] {
  const overrideSections = ENDORSED_FAQ_SECTIONS_BY_SLUG[slug];
  if (overrideSections && overrideSections.length > 0) {
    return overrideSections;
  }

  return ENDORSED_FAQ_SECTIONS_DEFAULT;
}

export function getEndorsedNdExperienceForSlug(
  slug: string
): EndorsedNdExperience | undefined {
  return ENDORSED_ND_EXPERIENCE_BY_SLUG[slug];
}

export function getTopStrengthAreasForSlug(slug: string): TopStrengthArea[] {
  const items = TOP_STRENGTH_AREAS_BY_SLUG[slug] ?? [];
  return items.slice(0, 4);
}

export function getStudyAreasForSlug(slug: string): string[] {
  return STUDY_AREAS_BY_SLUG[slug] ?? [];
}

export function getStaffNominationsForSlug(slug: string): StaffNomination[] {
  return STAFF_NOMINATIONS_BY_SLUG[slug] ?? [];
}

export function getSupportFrameworkForSlug(
  slug: string
): SupportFrameworkSection[] {
  return SUPPORT_FRAMEWORK_BY_SLUG[slug] ?? [];
}

export function isKnownEndorsedSlug(slug: string): boolean {
  return ENDORSED_SLUGS.includes(slug);
}

export function getEndorsedInstitutionCoursesUrl(
  slug: string
): string | undefined {
  const url = INSTITUTION_COURSES_URL_BY_SLUG[slug];
  return url && url.length > 0 ? url : undefined;
}

export function getEndorsedMetaStripInstitutionIconSrc(
  slug: string
): string | StaticImageData | undefined {
  const bundled = ENDORSED_PROVIDER_LOGO_BY_SLUG[slug];
  if (bundled) {
    return bundled;
  }
  const src = META_STRIP_INSTITUTION_ICON_BY_SLUG[slug];
  return src && src.length > 0 ? src : undefined;
}
