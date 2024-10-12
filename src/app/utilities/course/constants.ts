import {
  FilterCourseProps,
  CourseSortConfig,
  CourseProps,
} from '@/app/interfaces/Course';

export const MAX_COURSE_RATING = 5;
export const MAX_CRITERION_RATING = 5;

export const COURSE_FIELD_OPTIONS = {
  Neurotypes: [
    {
      label: 'Autism',
      value: 'Autism',
    },
    {
      label: 'ADHD',
      value: 'ADHD',
    },
    {
      label: 'Dyslexia',
      value: 'Dyslexia',
    },
    {
      label: 'Dyspraxia',
      value: 'Dyspraxia',
    },
    {
      label: 'Tourette',
      value: 'Tourette',
    },
    {
      label: 'Obsessive-Compulsive Disorder',
      value: 'OCD',
    },
    {
      label: 'Schizophrenia',
      value: 'Schizophrenia',
    },
    {
      label: 'Dyscalculia',
      value: 'Dyscalculia',
    },
    {
      label: 'Bipolar Disorder',
      value: 'Bipolar Disorder',
    },
  ],
  Level: [
    {
      label: 'Masters',
      value: 'MASTERS',
    },
    {
      label: 'Bachelors',
      value: 'BACHELORS',
    },
    {
      label: 'Doctorate',
      value: 'DOCTORATE',
    },
  ],
  Mode: [
    {
      label: 'Online',
      value: 'Online',
    },
    {
      label: 'On-campus',
      value: 'On-campus',
    },
    {
      label: 'Hybrid',
      value: 'Hybrid',
    },
  ],
  InterestArea: [
    {
      label: 'Information Technology',
      value: 'Information Technology',
    },
    {
      label: 'Computer Science',
      value: 'Computer Science',
    },
    {
      label: 'Data Science',
      value: 'Data Science',
    },
    {
      label: 'Cyber Security',
      value: 'Cyber Security',
    },
    {
      label: 'Software Engineering',
      value: 'Software Engineering',
    },
  ],
};

export const COURSE_FILTER_KEYS: (keyof FilterCourseProps)[] = [
  'Neurotypes',
  'InterestArea',
  'Location',
  'Level',
  'InstitutionName',
  'Mode',
];

export const COURSE_SORT_OPTIONS: {
  label: string;
  value: keyof CourseProps;
}[] = [
  {
    label: 'Title',
    value: 'Title',
  },
  {
    label: 'Institution Name',
    value: 'InstitutionName',
  },
  {
    label: 'Rating',
    value: 'Rating',
  },
  {
    label: 'Tier',
    value: 'Tier',
  },
  {
    label: 'Duration',
    value: 'Duration',
  },
];

export enum CourseTierValue {
  GOLD = 3,
  SILVER = 2,
  BRONZE = 1,
}

export const DEFAULT_COURSE_SORT_BY: CourseSortConfig['sortBy'] = 'Title';
export const DEFAULT_COURSE_SORT_ORDER: CourseSortConfig['sortOrder'] = 1;

export const COURSE_FETCH_REVALIDATE_PERIOD = 60 * 30; // In seconds
