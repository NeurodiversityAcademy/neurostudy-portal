'use client';

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { deviseContext } from '../deviseContext';
import { CourseProps, FilterCourseProps } from '@/app/interfaces/Course';
import useUpdatedValue from '@/app/hooks/useUpdatedValue';
import { useRouter, useSearchParams } from 'next/navigation';
import { COURSE_FILTER_KEYS } from './constants';
import queryString from '../queryString';
import { debounce } from '../common';

interface PropType {
  data: CourseProps[] | undefined;
  children: ReactNode;
}

export interface CourseContent {
  data: CourseProps[] | undefined;
  filter: Partial<FilterCourseProps>;
  updateFilter: (filter: Partial<FilterCourseProps>) => void;
  isLoading: boolean;
  loadData: (
    filter?: Partial<FilterCourseProps>,
    shouldDebounce?: boolean
  ) => Promise<void>;
}

const [CourseContext, useCourseContext] = deviseContext<CourseContent>();

export { CourseContext };
export { useCourseContext };

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

const updateRoute = ({
  search,
  setIsLoading,
  canReplace,
  router,
}: {
  search: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  canReplace: boolean;
  router: ReturnType<typeof useRouter>;
}) => {
  if ((window.location.search || '?') !== search) {
    setIsLoading(true);
    router.push(search, { scroll: false });
  } else if (canReplace) {
    setIsLoading(true);
    router.replace(search + '&_=' + Math.random(), { scroll: false });
  } else {
    setIsLoading(false);
  }
};
const updateRouteWithDebounce = debounce(updateRoute, 500);

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

      return data.filter((item) => {
        return filterEntries.every(([key, query]) => {
          return matches(item[key], query);
        });
      });
    }
  );

  const updateFilter = (filter: Partial<FilterCourseProps>) => {
    Object.assign(pendingFilterRef.current, filter);
  };

  const loadData = useCallback(
    async (
      filter?: Partial<FilterCourseProps>,
      shouldDebounce: boolean = false
    ) => {
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

      const fn = shouldDebounce ? updateRouteWithDebounce : updateRoute;
      shouldDebounce && setIsLoading(true);
      fn({
        search,
        setIsLoading,
        canReplace: !filter,
        router,
      });
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
