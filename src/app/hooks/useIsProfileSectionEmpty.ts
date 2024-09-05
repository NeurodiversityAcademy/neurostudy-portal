import { UserProps } from '../interfaces/User';
import useUpdatedValue from './useUpdatedValue';

export default function useIsProfileSectionEmpty<
  UserPropKeys extends keyof UserProps = keyof UserProps,
>(data: UserProps<UserPropKeys> | undefined) {
  return useUpdatedValue<boolean, UserProps<UserPropKeys> | undefined>(
    data,
    () => {
      if (!data) {
        return true;
      }

      let isEmpty = true;
      for (const key in data) {
        const value = data[key];
        if (Array.isArray(value)) {
          if (value.join('').length) {
            isEmpty = false;
            break;
          }
        } else if (value?.toString()) {
          isEmpty = false;
          break;
        }
      }
      return isEmpty;
    }
  );
}
