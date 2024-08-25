import { CourseWithoutIdProps } from '@/app/interfaces/Course';
import throwAssertionError from '../api/throwAssertionError';
import { DEFAULT_COURSE_WITHOUT_ID } from '../db/constants';

const throwError = throwAssertionError;

export default function assertCourseWithoutIdData(
  data: CourseWithoutIdProps[]
): asserts data is CourseWithoutIdProps[] {
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
      if (key in DEFAULT_COURSE_WITHOUT_ID) {
        /* @ts-expect-error: Server will check this at run-time (along with FE) */
        const expectedType: keyof typeof DEFAULT_COURSE_WITHOUT_ID =
          /* @ts-expect-error: Server will check this at run-time (along with FE) */
          typeof DEFAULT_COURSE_WITHOUT_ID[key];
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