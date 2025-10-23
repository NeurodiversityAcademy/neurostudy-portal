import { UserFormSubmissionType } from '@/app/interfaces/UserFormSubmissionType';
import { PHONE_REGEX, EMAIL_REGEX } from '../constants';

export function isValidContactUsFormData(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  obj: any
): obj is UserFormSubmissionType {
  const requiredKeys: (keyof UserFormSubmissionType)[] = [
    'firstname',
    'lastname',
    'email',
    'hs_persona',
  ];
  const keys = Object.keys(obj) as (keyof UserFormSubmissionType)[];
  return (
    (!obj.phone || PHONE_REGEX.test(obj.phone)) &&
    EMAIL_REGEX.test(obj.email) &&
    requiredKeys.every((key) => keys.includes(key))
  );
}
