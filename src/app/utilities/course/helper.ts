import {
  CoursePrimaryFilterType,
  CourseProps,
  CourseSecondaryFilterType,
  CourseSortConfig,
  FilterCourseProps,
} from '@/app/interfaces/Course';
import { Path, PathValue, UseFormReturn } from 'react-hook-form';
import { compare } from '../common';
import { CourseTierValue } from './constants';

export const updateCourseDropdownFilter = <
  T extends CoursePrimaryFilterType | CourseSecondaryFilterType,
>(
  name: Path<T>,
  value: unknown[] | undefined,
  methods: UseFormReturn<T>
) => {
  value = value || [];
  const oldValue = methods.getValues(name) || [];
  !compare(value, oldValue) &&
    setTimeout(() => methods.setValue(name, value as PathValue<T, Path<T>>));
};

const matches = (value: string | string[], queries: string[]): boolean => {
  if (!queries.length) {
    return true;
  }

  if (typeof value === 'string') {
    const valueLowerCase = value.toLowerCase();

    return queries.some((query) => {
      const parts = query.split(/\s+/).map((i) => i.toLowerCase());
      return parts.every((part) => valueLowerCase.includes(part));
    });
  }

  return value.some((item) => matches(item, queries));
};

export const filterCourses = (
  data: CourseProps[],
  filterEntries: [keyof FilterCourseProps, string[]][]
): CourseProps[] => {
  return data.filter((item) => {
    return filterEntries.every(([key, query]) => {
      return matches(item[key], query);
    });
  });
};

export const sortCourses = (
  data: CourseProps[],
  config?: CourseSortConfig
): CourseProps[] => {
  if (!config) {
    return data;
  }

  const { sortBy, sortOrder } = config;

  return data.sort((fst, snd) => {
    let fstValue = fst[sortBy];
    let sndValue = snd[sortBy];

    if (sortBy === 'Tier') {
      // @ts-expect-error: If not found, we resort to `0`
      fstValue = CourseTierValue[fstValue] || 0;
      // @ts-expect-error: If not found, we resort to `0`
      sndValue = CourseTierValue[sndValue] || 0;
    }

    if (typeof fstValue !== 'number' || typeof sndValue !== 'number') {
      fstValue = fstValue.toString().toLowerCase();
      sndValue = sndValue.toString().toLowerCase();
    }

    return fstValue > sndValue ? sortOrder : -sortOrder;
  });
};
