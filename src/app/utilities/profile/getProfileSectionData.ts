import { UserProps } from '@/app/interfaces/User';

export default function getProfileSectionData<
  T extends keyof UserProps = keyof UserProps,
>(data: UserProps, fields: readonly T[]): UserProps<T> {
  const value: UserProps<T> = {};

  for (const field of fields) {
    value[field] = data[field];
  }

  return value;
}
