import { UserSubscriptionType } from '@/app/interfaces/UserSubscriptionType';
import { EMAIL_REGEX } from '../constants';

export function isValidUserSubscriptionData(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  obj: any,
): obj is UserSubscriptionType {
  const requiredKeys: (keyof UserSubscriptionType)[] = ['email'];
  const keys = Object.keys(obj) as (keyof UserSubscriptionType)[];
  return EMAIL_REGEX.test(obj.email) && requiredKeys.every((key) => keys.includes(key));
}
