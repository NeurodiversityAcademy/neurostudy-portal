import { DEFAULT_COURSE } from '../auth/constants';
import { CourseProps } from '@/app/interfaces/Course';
import throwAssertionError from '../api/throwAssertionError';

const throwError = throwAssertionError;

export default function assertCourseData(
  data: CourseProps[]
): asserts data is CourseProps[] {
  if (!Array.isArray(data)) {
    throwError(`Invalid request payload, expected a JSON array.`);
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
