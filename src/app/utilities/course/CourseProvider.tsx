'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { deviseContext } from '../deviseContext';
import { CourseProps, FilterCourseProps } from '@/app/interfaces/Course';
import useUpdatedValue from '@/app/hooks/useUpdatedValue';
import { useRouter, useSearchParams } from 'next/navigation';
import { FILTER_KEYS } from './constants';
import queryString from '../queryString';

interface PropType {
  data: CourseProps[] | undefined;
  children: ReactNode;
}

export interface CourseContent {
  data: CourseProps[] | undefined;
  filter: Partial<FilterCourseProps>;
  isLoading: boolean;
  loadData: (filter: Partial<FilterCourseProps>) => Promise<void>;
}

const [CourseContext, useCourseContext] = deviseContext<CourseContent>();

export { CourseContext };
export { useCourseContext };

export default function CourseProvider({ children, data }: PropType) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterEntries: [keyof FilterCourseProps, string[]][] = useUpdatedValue(
    searchParams,
    () =>
      FILTER_KEYS.map((key) => [
        key,
        searchParams.getAll(key).map((item) => decodeURIComponent(item)),
      ])
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filteredData: CourseContent['data'] = useUpdatedValue(
    [...filterEntries.map(([, value]) => value.join(',')), data],
    () => {
      if (!data) {
        return undefined;
      }

      if (!filterEntries.some(([, value]) => !!value.length)) {
        return [...data];
      }

      return data.filter((dataItem) => {
        return filterEntries.every(([key, value]) => {
          if (!value.length) {
            return true;
          }
          const dataItemValue = dataItem[key];

          // TODO: Avoiding `dataItemValue`s which are array for the time being,
          // for instance, `Neurotypes` is an array. Fix that.
          if (!dataItemValue || Array.isArray(dataItemValue)) {
            return true;
          }

          const dataItemValueLC = dataItemValue.toLowerCase();

          return value.some(
            (item: string) => item.toLowerCase() === dataItemValueLC
          );
        });
      });
    }
  );

  const loadData = useCallback(
    async (filter: Partial<FilterCourseProps>) => {
      const oldFilter = Object.fromEntries(filterEntries);

      const search =
        queryString.stringify(
          Object.fromEntries(
            Object.entries({
              ...oldFilter,
              ...filter,
            }).filter(([, value]) => value?.length)
          )
        ) || '?';

      if ((window.location.search || '?') !== search) {
        setIsLoading(true);
        router.push(search);
      }
    },
    [filterEntries, router]
  );

  useEffect(() => {
    const onPopState = () => setIsLoading(true);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [data]);

  return (
    <CourseContext.Provider
      value={{
        data: filteredData,
        filter: Object.fromEntries(filterEntries),
        isLoading,
        loadData,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
