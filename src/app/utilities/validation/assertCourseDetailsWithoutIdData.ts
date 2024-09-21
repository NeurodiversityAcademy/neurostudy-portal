import { CourseDetailsWithoutIdProps } from '@/app/interfaces/Course';
import throwAssertionError from '../api/throwAssertionError';
import { DEFAULT_COURSE_DETAILS_WITHOUT_ID } from '../db/constants';

const throwError = throwAssertionError;

export default function assertCourseDetailsWithoutId(
  data: CourseDetailsWithoutIdProps
): asserts data is CourseDetailsWithoutIdProps {
  if (!data || typeof data !== 'object') {
    throwError(
      `Invalid prop 'courseDetailsWithoutId' supplied, expected an object with key-value pairs.`
    );
  }

  let key: string;
  for (key in data) {
    if (key in DEFAULT_COURSE_DETAILS_WITHOUT_ID) {
      /* @ts-expect-error: Server will check this at run-time (along with FE) */
      const expectedType: keyof typeof DEFAULT_COURSE_DETAILS_WITHOUT_ID =
        /* @ts-expect-error: Server will check this at run-time (along with FE) */
        typeof DEFAULT_COURSE_DETAILS_WITHOUT_ID[key];
      /* @ts-expect-error: Server will check this at run-time (along with FE) */
      const providedType: unknown = typeof data[key];
      if (expectedType !== providedType) {
        throwError(
          `Invalid prop 'courseDetailsWithoutId["${key}"]' of type '${providedType}' supplied, expected '${expectedType}'.`
        );
      }
    } else {
      throwError(
        `Invalid prop key '${key}' found in 'courseDetailsWithoutId'.`
      );
    }
  }
}
