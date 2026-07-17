import { TeacherRegistrationType } from '../../interfaces/TeacherRegistrationType';
import { NAME_REGEX, PHONE_REGEX, EMAIL_REGEX } from '../constants';

export function isValidTeacherRegistrationData(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  obj: any,
): obj is TeacherRegistrationType {
  const requiredKeys: (keyof TeacherRegistrationType)[] = ['firstname', 'lastname', 'email'];
  const keys = Object.keys(obj) as (keyof TeacherRegistrationType)[];

  return (
    NAME_REGEX.test(obj.firstname) &&
    NAME_REGEX.test(obj.lastname) &&
    PHONE_REGEX.test(obj.phone) &&
    EMAIL_REGEX.test(obj.email) &&
    requiredKeys.every((key) => keys.includes(key))
  );
}
