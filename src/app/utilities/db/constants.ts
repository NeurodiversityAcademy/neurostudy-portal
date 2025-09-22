import { AttributeDefinition } from '@aws-sdk/client-dynamodb';

export const COURSE_TABLE_NAME = process.env.COURSE_TABLE_NAME || 'NDACourses';
export const COURSE_TABLE_PARTITION_KEY = 'CourseId';
export const COURSE_TABLE_INDEX_KEY_DEFINITIONS: AttributeDefinition[] = [
  { AttributeName: 'InstitutionName', AttributeType: 'S' },
  { AttributeName: 'InterestArea', AttributeType: 'S' },
];

interface JobRequirements {
  junior: Record<string, string>;
  senior: Record<string, string>;
  lead: Record<string, string>;
}

interface JobRequirement {
  requirements: JobRequirements;
}

interface PossibleJobRequirements {
  [jobTitle: string]: JobRequirement;
}

// NOTE
// These will be here until we utilize `zod` or similar validation library
// This helps us to generate a type based on the given attribute values
// and validate/assert based on that as well
export const DEFAULT_COURSE_WITHOUT_ID = {
  InstitutionName: 'Central Queensland University',
  Title: 'Bachelor of Laws',
  Location: 'Sydney',
  Duration: 24,
  Rating: 3.9,
  Tier: 'GOLD',
  Criteria: {
    Faculty: 4,
  },
  Level: 'MASTERS',
  InterestArea: 'Cyber Security',
  Mode: 'Hybrid',
  Neurotypes: [''],
};
export const DEFAULT_COURSE = {
  [COURSE_TABLE_PARTITION_KEY]: 'azAz1.!',
  ...DEFAULT_COURSE_WITHOUT_ID,
};

// TODO
// Should throw error if the keys are not part of table
export const COURSE_TABLE_FILTERABLE_NON_INDEX_KEYS = [
  'Title',
  'Level',
  'Location',
  'Mode',
  'Tier',
];

export const COURSE_DETAILS_TABLE_NAME =
  process.env.COURSE_DETAILS_TABLE_NAME || 'NDACourseDetails';
export const COURSE_DETAILS_TABLE_PARTITION_KEY = COURSE_TABLE_PARTITION_KEY;
export const COURSE_DETAILS_TABLE_INDEX_KEY_DEFINITIONS: AttributeDefinition[] =
  [];

// NOTE
// These will be here until we utilize `zod` or similar validation library
// This helps us to generate a type based on the given attribute values
// and validate/assert based on that as well
export const DEFAULT_COURSE_DETAILS_WITHOUT_ID = {
  Overview: 'HTML or string',
  Structure: 'HTML or string',
  EntryRequirements: 'HTML or string',
  TuitionsAndFees: 'HTML or string',
  CareerOpportunities: 'HTML or string',
  PreviousCredits: 'HTML or string',
  KeyCodes: 'HTML or string',
  AboutUniversity: 'HTML or string',
  FAQS: 'HTML or string',
  InstitutionName: 'HTML or string',
  InstitutionLogoUrl: 'HTML or string',
  Title: 'HTML or string',
  Subtitle: 'HTML or string',
  Description: 'HTML or string',
  Mode: 'HTML or string',
  Duration: 24,
  ApplicationEnd: 'HTML or string',
  Subjects: 'HTML or string',
  SupportAvailable: ['HTML or string'],
  AdjustmentsAvailable: {
    AssessmentAdjustments: ['HTML or string'],
    LearningDeliveryAdjustments: ['HTML or string'],
    EnvironmentalAdjustments: ['HTML or string'],
  },
  PossibleJobRequirement: {} as PossibleJobRequirements,
  Fees: 'HTML or string',
};
export const DEFAULT_COURSE_DETAILS = {
  [COURSE_DETAILS_TABLE_PARTITION_KEY]: 'azAz1.!',
  ...DEFAULT_COURSE_DETAILS_WITHOUT_ID,
};
