import { UserProps } from '@/app/interfaces/User';

export const PREFERENCE_FIELDS = [
  'Conditions',
  'Institutions',
  'EnvDescription',
] as const;

export const GOAL_FIELDS = ['Contents'] as const;

export const PROFILE_LABEL_MAPPER: Partial<Record<keyof UserProps, string>> = {
  Conditions: 'Neuro-Condition',
  Institutions: 'Learning Institution',
  EnvDescription: 'Ideal Learning Environment',
  Contents: 'Most Engaging Content',
};
