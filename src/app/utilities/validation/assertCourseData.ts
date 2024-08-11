import APIError from '@/app/interfaces/APIError';
import { DEFAULT_COURSE } from '../auth/constants';
import { CourseProps } from '@/app/interfaces/Course';

const RETURN_DEFAULT_ERROR_MESSAGE = process.env.NODE_ENV === 'production';
const DEFAULT_ERROR_MESSAGE = `Provided user doesn't satisfy type-check.`;

const throwError = (message: string): void => {
  throw new APIError({
    error: RETURN_DEFAULT_ERROR_MESSAGE ? DEFAULT_ERROR_MESSAGE : message,
    status: 400,
  });
};

export default function assertCourseData(
  data: CourseProps[]
): asserts data is CourseProps[] {
  if (!Array.isArray(data)) {
    throwError(`Invalid request payload, expected a JSON array.`);
  }

  const { length } = data;
  if (length < 1 || length > 25) {
    throwError(`Length of the data should be between 1 & 25, inclusive.`);
  }

  let index: number = -1;
  for (const item of data) {
    index++;
    if (!item || typeof item !== 'object') {
      throwError(`Invalid item (index no. "${index}") supplied.`);
    }

    let key: string;
    for (key in item) {
      if (key in DEFAULT_COURSE) {
        /* @ts-expect-error: Server will check this at run-time (along with FE) */
        const expectedType: keyof typeof DEFAULT_COURSE =
          /* @ts-expect-error: Server will check this at run-time (along with FE) */
          typeof DEFAULT_COURSE[key];
        /* @ts-expect-error: Server will check this at run-time (along with FE) */
        const providedType: unknown = typeof item[key];
        if (expectedType !== providedType) {
          throwError(
            `Invalid prop 'item[${index}]["${key}"]' of type '${providedType}' supplied, expected '${expectedType}'.`
          );
        }
      } else {
        throwError(`Invalid prop key '${key}' found in 'item[${index}]'.`);
      }
    }
  }
}
