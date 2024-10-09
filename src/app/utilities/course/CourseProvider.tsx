'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { deviseContext } from '../deviseContext';
import { CourseProps, FilterCourseProps } from '@/app/interfaces/Course';
import useUpdatedValue from '@/app/hooks/useUpdatedValue';
import { useRouter, useSearchParams } from 'next/navigation';
import { COURSE_FILTER_KEYS } from './constants';
import queryString from '../queryString';

interface PropType {
  data: CourseProps[] | undefined;
  children: ReactNode;
}

export interface CourseContent {
  data: CourseProps[] | undefined;
  filter: Partial<FilterCourseProps>;
  updateFilter: (filter: Partial<FilterCourseProps>) => void;
  isLoading: boolean;
  loadData: (filter?: Partial<FilterCourseProps>) => Promise<void>;
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
      COURSE_FILTER_KEYS.map((key) => [
        key,
        searchParams.getAll(key).map((item) => decodeURIComponent(item)),
      ])
  );
  const pendingFilterRef = useRef<Partial<FilterCourseProps>>({});
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

  const updateFilter = (filter: Partial<FilterCourseProps>) => {
    Object.assign(pendingFilterRef.current, filter);
  };

  const loadData = useCallback(
    async (filter?: Partial<FilterCourseProps>) => {
      const oldFilter = Object.fromEntries(filterEntries);

      const search =
        queryString.stringify(
          Object.fromEntries(
            Object.entries({
              ...oldFilter,
              ...pendingFilterRef.current,
              ...filter,
              _: undefined,
            }).map(([key, value]) => [key, value?.length ? value : undefined])
          ),
          { useLocationSearch: true }
        ) || '?';

      if ((window.location.search || '?') !== search) {
        setIsLoading(true);
        router.push(search, { scroll: false });
      } else if (!filter) {
        router.replace(search + '&_=' + Math.random(), { scroll: false });
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
    pendingFilterRef.current = {};
  }, [data]);

  return (
    <CourseContext.Provider
      value={{
        data: filteredData,
        filter: Object.fromEntries(filterEntries),
        updateFilter,
        isLoading,
        loadData,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
