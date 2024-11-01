import {
  FilterCourseProps,
  CourseSortConfig,
  CourseProps,
} from '@/app/interfaces/Course';
import { HOST_URL } from '../constants';

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
    'Education',
    'Information Technology',
    'Psychology',
    'Social Work',
    'Arts in International Relations',
    'Health Sciences',
    'Finance',
    'Civil Engineering',
    'International Business',
    'Public Health',
    'Environmental Science',
    'Engineering',
    'Biotechnology',
    'Computer Science',
    'Laws',
    'Design',
    'Medicine',
    'Applied Science',
    'Humanities',
    'Media and Communication',
    'Business Administration',
    'Digital Marketing',
    'Nursing',
    'Music',
    'Chemical Engineering',
    'Data Science',
    'Fine Arts',
    'Commerce',
    'Information Systems',
    'Sport and Exercise Science',
    'Agriculture',
    'Engineering Management',
    'Human Resources',
    'Law',
    'Public Policy',
    'Veterinary Science',
    'Urban Planning',
  ].map((i) => ({ label: i, value: i })),
  Location: [
    'Melbourne',
    'Perth',
    'Sydney',
    'Brisbane',
    'Newcastle',
    'Adelaide',
    'Cairns',
    'Hobart',
    'Canberra',
    'Coffs',
    'Toowoomba',
    'Rockhampton',
    'Wollongong',
    'Sunshine',
    'Bathurst',
    'Gold',
    'Fremantle',
    'Penrith',
    'Lismore',
    'Wagga',
    'Darwin',
    'Armidale',
    'Geelong',
  ].map((i) => ({ label: i, value: i })),
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

export const COURSE_TEST_DATA_QUERY_KEY = 'test';
export const COURSE_TEST_ENROL_KEY = 'test';

export const COURSE_CHECKOUT_CALLBACK_URL =
  HOST_URL + '/api/course/checkoutCallback';
export const COURSE_ENROL_POPUP_CLOSED_KEY = 'cepck-';
