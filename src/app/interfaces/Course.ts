import {
  DEFAULT_COURSE,
  DEFAULT_COURSE_WITHOUT_ID,
} from '../utilities/db/constants';

export type CourseProps = Partial<typeof DEFAULT_COURSE>;

export type CourseWithoutIdProps = Partial<typeof DEFAULT_COURSE_WITHOUT_ID>;
