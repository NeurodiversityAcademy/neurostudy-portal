import { CourseSortConfig } from '@/app/interfaces/Course';
import { DEFAULT_COURSE } from '../db/constants';
import { DEFAULT_COURSE_SORT_BY, DEFAULT_COURSE_SORT_ORDER } from './constants';

export default function extractCourseSortConfig({
  sortBy,
  sortOrder,
}: {
  sortBy?: string | null;
  sortOrder?: string | number | null;
}) {
  sortBy = sortBy && sortBy in DEFAULT_COURSE ? sortBy : undefined;
  sortOrder = +(sortOrder ?? '0');
  sortOrder = [1, -1].includes(sortOrder)
    ? sortOrder
    : DEFAULT_COURSE_SORT_ORDER;

  sortBy = sortBy || DEFAULT_COURSE_SORT_BY;
  sortOrder = sortOrder || DEFAULT_COURSE_SORT_ORDER;

  // TODO: Since we're asserting, let's make it more robust
  return {
    sortBy,
    sortOrder,
  } as CourseSortConfig;
}
