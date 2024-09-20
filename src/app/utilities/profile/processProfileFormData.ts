import { DEFAULT_USER } from '../auth/constants';
import assertUserProps from '../validation/assertUserData';

export default function processProfileFormData(_user: Record<string, unknown>) {
  const user = { ..._user };

  Object.keys(user).forEach((key: string) => {
    if (!(key in DEFAULT_USER)) {
      delete user[key];
    } else {
      // TODO
      // We will use proper input components and then solve this accordingly
      /* @ts-expect-error: Following line won't require proper type checking of `key` */
      if (Array.isArray(DEFAULT_USER[key])) {
        user[key] = (user[key] as string)
          .split(',')
          .map((item: string) => item.trim());
        /* @ts-expect-error: Following line won't require proper type checking of `key` */
      } else if (typeof DEFAULT_USER[key] === 'number') {
        user[key] = parseInt(user[key] as string);
      }
    }
  });

  assertUserProps(user);

  return user;
}
