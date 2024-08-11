import { UserProps } from '@/app/interfaces/User';
import { DEFAULT_USER } from '../auth/constants';
import APIError from '@/app/interfaces/APIError';

const RETURN_DEFAULT_ERROR_MESSAGE = process.env.NODE_ENV === 'production';
const DEFAULT_ERROR_MESSAGE = `Provided user doesn't satisfy type-check.`;

const throwError = (message: string): void => {
  throw new APIError({
    error: RETURN_DEFAULT_ERROR_MESSAGE ? DEFAULT_ERROR_MESSAGE : message,
    status: 400,
  });
};

export default function assertUserProps(
  user: UserProps
): asserts user is UserProps {
  if (!user || typeof user !== 'object') {
    throwError(
      `Invalid prop 'user' supplied, expected an object with key-value pairs.`
    );
  }

  let key: string;
  for (key in user) {
    if (key in DEFAULT_USER) {
      /* @ts-expect-error: Server will check this at run-time (along with FE) */
      const expectedType: keyof typeof DEFAULT_USER = typeof DEFAULT_USER[key];
      /* @ts-expect-error: Server will check this at run-time (along with FE) */
      const providedType: unknown = typeof user[key];
      if (expectedType !== providedType) {
        throwError(
          `Invalid prop 'user["${key}"]' of type '${providedType}' supplied, expected '${expectedType}'.`
        );
      }
    } else {
      throwError(`Invalid prop key '${key}' found in 'user'.`);
    }
  }
}
