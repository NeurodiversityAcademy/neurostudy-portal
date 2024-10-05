'use client';

import { ReactNode, useState } from 'react';
import { deviseContext } from '../deviseContext';
import { CourseProps, FilterCourseProps } from '@/app/interfaces/Course';
import useUpdatedValue from '@/app/hooks/useUpdatedValue';

interface PropType {
  data: CourseProps[] | undefined;
  children: ReactNode;
}

export interface CourseContent {
  data: CourseProps[] | undefined;
  loadData: (filter: FilterCourseProps) => Promise<void>;
}

const [CourseContext, useCourseContext] = deviseContext<CourseContent>();

export { CourseContext };
export { useCourseContext };

export default function CourseProvider({ children, data }: PropType) {
  const [filter, setFilter] = useState<Partial<FilterCourseProps>>();

  const loadData = async (_filter: Partial<FilterCourseProps>) => {
    setFilter((filter) => ({ ...filter, ..._filter }));
  };

  const filteredData: CourseContent['data'] = useUpdatedValue(
    [filter, data],
    () => {
      if (!data) {
        return undefined;
      }

      if (!filter || !Object.values(filter).some((item) => !!item)) {
        return [...data];
      }

      return data.filter((item) => {
        // TODO: Optimize
        return Object.entries(filter).some(([key, filterValues]) => {
          const itemValue = item[key as keyof CourseProps];

          // NOTE: Avoiding item values which are array for the time being,
          // for instance, `Neurotypes` is an array
          return (
            itemValue &&
            !Array.isArray(itemValue) &&
            filterValues &&
            (filterValues as unknown[]).includes(itemValue)
          );
        });
      });
    }
  );

  return (
    <CourseContext.Provider value={{ data: filteredData, loadData }}>
      {children}
    </CourseContext.Provider>
  );
}
