import { ProfileFieldsType } from '@/app/interfaces/Profile';
import { UserProps } from '@/app/interfaces/User';

export const PREFERENCE_FIELDS = [
  'Conditions',
  'Institutions',
  'LearningStyle',
  'Adjustments',
  'UsedTools',
  'EnvDescription',
  'LearningStyle',
] as const;

export const GOAL_FIELDS = ['Goals', 'Interests', 'Contents'] as const;

export const CHALLENGE_FIELDS = [
  'Comforts',
  'Struggles',
  'Challenges',
] as const;

export const STRATEGY_FIELDS = [
  'Strategies',
  'ManagingWays',
  'FocusAids',
  'MeetNDLearners',
  'EffectiveStrategy',
] as const;

export const PROFILE_LABEL_MAPPER: Partial<Record<keyof UserProps, string>> = {
  Conditions: 'Neuro-Condition',
  Institutions: 'Learning Institution',
  EnvDescription: 'Ideal Learning Environment',
  Contents: 'Most Engaging Content',
  Comforts: 'Things you are comfortable with',
  Struggles: 'Things that you have struggled with in the past',
  Challenges: 'Tell us about the challenges that you have faced in the past',
  Strategies: 'Time Management Strategies',
  ManagingWays: 'Sensory Overload Management in Learning Environments',
  EffectiveStrategy: 'Effective Learning Strategy',
  LearningStyle: 'Preferred Learning Style',
  Adjustments: 'Adjustments Needed',
  UsedTools: 'Tools Used in Past',
  Goals: 'Learning Goals',
  Interests: 'Topics of Interest',
  FocusAids: 'Access to Focus Aids',
  MeetNDLearners: 'Interest in Meeting/Collaborating with Other ND Learners',
};

export const PROFILE_EMPTY_ATTRIBUTE_MAP = new Map<
  ProfileFieldsType,
  {
    label: string;
    value: string;
    btnText: string;
  }
>([
  [
    PREFERENCE_FIELDS,
    {
      label: 'Answer few questions',
      value: 'Tell us about your Neuro Condition & Learning Preferences',
      btnText: 'Learning Preferences',
    },
  ],
  [
    GOAL_FIELDS,
    {
      label: 'Answer few questions',
      value: 'Tell us about your Goals & Interests',
      btnText: 'Goals & Interests',
    },
  ],
  [
    CHALLENGE_FIELDS,
    {
      label: 'Answer few questions',
      value: 'Tell us about your Comfort & Challenges',
      btnText: 'Comfort & Challenges',
    },
  ],
  [
    STRATEGY_FIELDS,
    {
      label: 'Answer few questions',
      value: 'Tell us about your Strategies',
      btnText: 'Strategies',
    },
  ],
]);

export const PROFILE_FIELD_OPTIONS = {
  Conditions: [
    {
      label: 'ADHD',
      value: 'ADHD',
    },
    {
      label: 'Dyslexia',
      value: 'Dyslexia',
    },
    {
      label: 'Tourette',
      value: 'Tourette',
    },
  ],
  Institutions: [],
  Contents: [],
  Comforts: [],
  Struggles: [],
  Challenges: [],
  Strategies: [],
  ManagingWays: [],
  LearningStyle: [
    { label: 'Visual', value: 'Visual' },
    { label: 'Auditory', value: 'Auditory' },
    { label: 'Kinesthetic', value: 'Kinesthetic' },
  ],
  FocusAids: [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ],
  MeetNDLearners: [
    { label: 'Yes, I would love to.', value: true },
    { label: "No, I don't want to.", value: false },
  ],
  Adjustments: [
    { label: 'Better Classroom', value: 'Better Classroom' },
    { label: 'Air Conditioning', value: 'Air Conditioning' },
  ],
  UsedTools: [{ label: 'Fidget', value: 'Fidget' }],
  Goals: [
    { label: 'Get a Job', value: 'Get a Job' },
    { label: 'Improve Skills', value: 'Improve Skills' },
    { label: 'Get Promoted', value: 'Get Promoted' },
    { label: 'Network with People', value: 'Network with People' },
    { label: 'Find Events', value: 'Find Events' },
  ],
  Interests: [
    { label: 'Carpentry', value: 'Carpentry' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Get Promoted', value: 'Get Promoted' },
    { label: 'Design', value: 'Design' },
    { label: 'Chemistry', value: 'Chemistry' },
  ],
};
