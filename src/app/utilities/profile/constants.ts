import { ProfileFieldsType } from '@/app/interfaces/Profile';
import { UserProps } from '@/app/interfaces/User';

export enum USER_DATA_KEY{
  FIRST_NAME = 'FirstName',
  LAST_NAME = 'LastName',
  DATE_OF_BIRTH = 'DOB',
  AGE = 'Age',
  CONDITIONS = 'Conditions',
  INSTITUTIONS = 'Institutions',
  ENV_DESCRIPTION = 'EnvDescription',
  STRATEGIES = 'Strategies',
  MANAGING_WAYS = 'ManagingWays',
  EFFECTIVE_STRATEGY = 'EffectiveStrategy',
  CONTENTS = 'Contents',
  COMFORTS = 'Comforts',
  STRUGGLES = 'Struggles',
  CHALLENGES = 'Challenges',
  LEARNING_STYLE = 'LearningStyle',
  FOCUS_AIDS = 'FocusAids',
  MEET_NDL_LEARNERS = 'MeetNDLearners',
  ADJUSTMENTS = 'Adjustments',
  USED_TOOLS = 'UsedTools',
  GOALS = 'Goals',
  INTERESTS = 'Interests',
}

export const PREFERENCE_FIELDS = [
  USER_DATA_KEY.CONDITIONS,
  USER_DATA_KEY.INSTITUTIONS,
  USER_DATA_KEY.LEARNING_STYLE,
  USER_DATA_KEY.ADJUSTMENTS,
  USER_DATA_KEY.USED_TOOLS,
  USER_DATA_KEY.ENV_DESCRIPTION,
  USER_DATA_KEY.LEARNING_STYLE,
] as const;

export const GOAL_FIELDS = [USER_DATA_KEY.GOALS, USER_DATA_KEY.INTERESTS, USER_DATA_KEY.CONTENTS] as const;

export const CHALLENGE_FIELDS = [
  USER_DATA_KEY.COMFORTS,
  USER_DATA_KEY.STRUGGLES,
  USER_DATA_KEY.CHALLENGES,
] as const;

export const STRATEGY_FIELDS = [
  USER_DATA_KEY.STRATEGIES,
  USER_DATA_KEY.MANAGING_WAYS,
  USER_DATA_KEY.FOCUS_AIDS,
  USER_DATA_KEY.MEET_NDL_LEARNERS,
  USER_DATA_KEY.EFFECTIVE_STRATEGY,
] as const;

export const PROFILE_LABEL_MAPPER: Partial<Record<keyof UserProps, string>> = {
  [USER_DATA_KEY.CONDITIONS]: 'Neuro-Condition',
  [USER_DATA_KEY.INSTITUTIONS]: 'Learning Institution',
  [USER_DATA_KEY.ENV_DESCRIPTION]: 'Ideal Learning Environment',
  [USER_DATA_KEY.CONTENTS]: 'Most Engaging Content',
  [USER_DATA_KEY.COMFORTS]: 'Things you are comfortable with',
  [USER_DATA_KEY.STRUGGLES]: 'Things that you have struggled with in the past',
  [USER_DATA_KEY.CHALLENGES]: 'Tell us about the challenges that you have faced in the past',
  [USER_DATA_KEY.STRATEGIES]: 'Time Management Strategies',
  [USER_DATA_KEY.MANAGING_WAYS]: 'Sensory Overload Management in Learning Environments',
  [USER_DATA_KEY.EFFECTIVE_STRATEGY]: 'Effective Learning Strategy',
  [USER_DATA_KEY.LEARNING_STYLE]: 'Preferred Learning Style',
  [USER_DATA_KEY.ADJUSTMENTS]: 'Adjustments Needed',
  [USER_DATA_KEY.USED_TOOLS]: 'Tools Used in Past',
  [USER_DATA_KEY.GOALS]: 'Learning Goals',
  [USER_DATA_KEY.INTERESTS]: 'Topics of Interest',
  [USER_DATA_KEY.FOCUS_AIDS]: 'Access to Focus Aids',
  [USER_DATA_KEY.MEET_NDL_LEARNERS]: 'Interest in Meeting/Collaborating with Other ND Learners',
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
  [USER_DATA_KEY.CONDITIONS]: [
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
  [USER_DATA_KEY.INSTITUTIONS]: [],
  [USER_DATA_KEY.CONTENTS]: [],
  [USER_DATA_KEY.COMFORTS]: [],
  [USER_DATA_KEY.STRUGGLES]: [],
  [USER_DATA_KEY.CHALLENGES]: [],
  [USER_DATA_KEY.STRATEGIES]: [],
  [USER_DATA_KEY.MANAGING_WAYS]: [],
  [USER_DATA_KEY.LEARNING_STYLE]: [
    { label: 'Visual', value: 'Visual' },
    { label: 'Auditory', value: 'Auditory' },
    { label: 'Kinesthetic', value: 'Kinesthetic' },
  ],
  [USER_DATA_KEY.FOCUS_AIDS]: [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ],
  [USER_DATA_KEY.MEET_NDL_LEARNERS]: [
    { label: 'Yes, I would love to.', value: true },
    { label: "No, I don't want to.", value: false },
  ],
  [USER_DATA_KEY.ADJUSTMENTS]: [
    { label: 'Better Classroom', value: 'Better Classroom' },
    { label: 'Air Conditioning', value: 'Air Conditioning' },
  ],
  [USER_DATA_KEY.USED_TOOLS]: [{ label: 'Fidget', value: 'Fidget' }],
  [USER_DATA_KEY.GOALS]: [
    { label: 'Get a Job', value: 'Get a Job' },
    { label: 'Improve Skills', value: 'Improve Skills' },
    { label: 'Get Promoted', value: 'Get Promoted' },
    { label: 'Network with People', value: 'Network with People' },
    { label: 'Find Events', value: 'Find Events' },
  ],
  [USER_DATA_KEY.INTERESTS]: [
    { label: 'Carpentry', value: 'Carpentry' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Get Promoted', value: 'Get Promoted' },
    { label: 'Design', value: 'Design' },
    { label: 'Chemistry', value: 'Chemistry' },
  ],
};
