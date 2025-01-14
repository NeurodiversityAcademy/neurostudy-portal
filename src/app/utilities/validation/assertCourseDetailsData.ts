import { CourseDetailsProps } from '@/app/interfaces/Course';
import throwAssertionError from '../api/throwAssertionError';
import { DEFAULT_COURSE_DETAILS } from '../db/constants';

const throwError = throwAssertionError;

export default function assertCourseDetails(
  data: unknown
): asserts data is CourseDetailsProps {
  if (!data || typeof data !== 'object') {
    throwError(
      `Invalid prop 'courseDetails' supplied, expected an object with key-value pairs.`
    );
  }

  const dataObj = data as Record<string, unknown>;

  for (const key in dataObj) {
    if (key in DEFAULT_COURSE_DETAILS) {
      /* @ts-expect-error: Server will check this at run-time (along with FE) */
      const expectedType: keyof typeof DEFAULT_COURSE_DETAILS =
        /* @ts-expect-error: Server will check this at run-time (along with FE) */
        typeof DEFAULT_COURSE_DETAILS[key];
      /* @ts-expect-error: Server will check this at run-time (along with FE) */
      const providedType: unknown = typeof data[key];
      if (expectedType !== providedType) {
        throwError(
          `Invalid prop 'courseDetails["${key}"]' of type '${providedType}' supplied, expected '${expectedType}'.`
        );
      }
    } else {
      throwError(`Invalid prop key '${key}' found in 'courseDetails'.`);
    }
  }
}
