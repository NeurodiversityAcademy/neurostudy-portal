import { FilterCourseProps } from '@/app/interfaces/Course';
import TrainedStaff from '@/app/images/people-repeat.png';
import Feedback from '@/app/images/feedback.png';
import FiveSenses from '@/app/images/five_senses.png';
import LearningTools from '@/app/images/learning_tools.png';
import AlternativeAssessmentMethods from '@/app/images/open_enrolment.png';
import ReadingMode from '@/app/images/reading_mode.png';
import UniversalDesignforLearning from '@/app/images/search_nearby.png';
import TeachingPractice from '@/app/images/teaching_practice.png';
import InclusivePolicies from '@/app/images/waitlist.png';

export const MAX_COURSE_RATING = 5;
export const MAX_CRITERION_RATING = 5;

export const COURSE_FIELD_OPTIONS = {
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
      value: 'v',
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

export const FILTER_KEYS: (keyof FilterCourseProps)[] = [
  'Neurotypes',
  'InterestArea',
  'Location',
  'Level',
  'InstitutionName',
  'Mode',
];

export const COURSE_FETCH_REVALIDATE_PERIOD = 60 * 30; // In seconds

export const COURSE_BENEFIT_SUPPORT_AVAILABLE = {
  TrainedStaff: {
    label: 'Trained Staff',
    icon: TrainedStaff,
  },
  UniversalDesignForLearning: {
    label: 'Universal Design for Learning',
    icon: UniversalDesignforLearning,
  },
  InclusivePolicies: {
    label: 'Inclusive policies',
    icon: InclusivePolicies,
  },
  AlternativeAssessmentMethods: {
    label: 'Alternative assessment methods',
    icon: AlternativeAssessmentMethods,
  },
  RegularFeedbackMechanisms: {
    label: 'Regular feedback mechanisms',
    icon: Feedback,
  },
  SensoryBreaks: {
    label: 'Sensory breaks',
    icon: FiveSenses,
  },
  SpecializedAcademicAdvising: {
    label: 'Specialized academic advising',
    icon: LearningTools,
  },
  AccessibleTextbooks: {
    label: 'Accessible textbooks',
    icon: ReadingMode,
  },
  InclusiveTeachingPractices: {
    label: 'Inclusive teaching practices',
    icon: TeachingPractice,
  },
};
