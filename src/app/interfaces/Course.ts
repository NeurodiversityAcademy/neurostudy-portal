import {
  DEFAULT_COURSE,
  DEFAULT_COURSE_DETAILS,
  DEFAULT_COURSE_DETAILS_WITHOUT_ID,
  DEFAULT_COURSE_WITHOUT_ID,
} from '../utilities/db/constants';

export type CourseProps = Partial<typeof DEFAULT_COURSE>;
export type CourseWithoutIdProps = Partial<typeof DEFAULT_COURSE_WITHOUT_ID>;
export type CourseDetailsProps = Partial<typeof DEFAULT_COURSE_DETAILS>;
export type CourseDetailsWithoutIdProps = Partial<
  typeof DEFAULT_COURSE_DETAILS_WITHOUT_ID
>;
export type FilterCourseProps = {
  [K in keyof CourseProps]: CourseProps[K] extends unknown[]
    ? CourseProps[K]
    : CourseProps[K][];
};
