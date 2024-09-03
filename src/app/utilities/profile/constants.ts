import { UserProps } from '@/app/interfaces/User';

export const PREFERENCE_FIELDS = [
  'Conditions',
  'Institutions',
  'EnvDescription',
] as const;

export const PROFILE_LABEL_MAPPER: Partial<Record<keyof UserProps, string>> = {
  Conditions: 'Neuro-Condition',
  Institutions: 'Learning Institution',
  EnvDescription: 'Ideal Learning Environment',
};
