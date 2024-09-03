import { UserProps } from '@/app/interfaces/User';

export const PREFERENCE_FIELDS = [
  'Conditions',
  'Institutions',
  'EnvDescription',
] as const;

export const GOAL_FIELDS = ['Contents'] as const;

export const CHALLENGE_FIELDS = [
  'Comforts',
  'Struggles',
  'Challenges',
] as const;

export const STRATEGY_FIELDS = [
  'Strategies',
  'ManagingWays',
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
};
