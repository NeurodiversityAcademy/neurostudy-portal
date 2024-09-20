import { UserProps } from '../interfaces/User';
import useUpdatedValue from './useUpdatedValue';

export default function useIsProfileSectionEmpty(data: UserProps | undefined) {
  return useUpdatedValue<boolean, UserProps | undefined>(data, () => {
    if (!data) {
      return true;
    }

    let isEmpty = true;
    for (const key in data) {
      /* @ts-expect-error: It isn't important to get the specific type */
      const value = data[key];
      if (Array.isArray(value)) {
        if (value.join('').length) {
          isEmpty = false;
          break;
        }
      } else if (typeof value === 'boolean') {
        isEmpty = false;
        break;
      } else if (value?.toString?.()) {
        isEmpty = false;
        break;
      }
    }
    return isEmpty;
  });
}
