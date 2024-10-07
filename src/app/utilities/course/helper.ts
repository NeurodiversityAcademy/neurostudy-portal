import {
  CoursePrimaryFilterType,
  CourseSecondaryFilterType,
} from '@/app/interfaces/Course';
import { Path, PathValue, UseFormReturn } from 'react-hook-form';
import { compare } from '../common';

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
