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
import {
  CourseProps,
  FilterCourseProps,
  CourseSortConfig,
} from '@/app/interfaces/Course';
import useUpdatedValue from '@/app/hooks/useUpdatedValue';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  COURSE_FILTER_KEYS,
  DEFAULT_COURSE_SORT_BY,
  DEFAULT_COURSE_SORT_ORDER,
} from './constants';
import queryString from '../queryString';
import { debounce } from '../common';
import extractCourseSortConfig from './extractSortConfig';
import { filterCourses, sortCourses } from './helper';

interface PropType {
  redirectToSearchPage?: boolean;
  data?: CourseProps[];
  children: ReactNode;
}

interface LoadDataConfig {
  sortBy?: CourseSortConfig['sortBy'];
  sortOrder?: CourseSortConfig['sortOrder'];
  shouldDebounce?: boolean;
  redirectToSearchPage?: boolean;
}

export interface CourseContent extends CourseSortConfig {
  data: CourseProps[] | undefined;
  filter: Partial<FilterCourseProps>;
  updateFilter: (filter: Partial<FilterCourseProps>) => void;
  isLoading: boolean;
  loadData: (
    filter?: Partial<FilterCourseProps>,
    config?: LoadDataConfig
  ) => Promise<void>;
}

const [CourseContext, useCourseContext] = deviseContext<CourseContent>();

export { CourseContext };
export { useCourseContext };

const updateRoute = ({
  redirectToSearchPage = false,
  search,
  setIsLoading,
  canReplace,
  router,
}: {
  redirectToSearchPage?: boolean;
  search: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  canReplace: boolean;
  router: ReturnType<typeof useRouter>;
}) => {
  const to = (redirectToSearchPage ? '/courses' : '') + search;

  const urlMatches =
    (redirectToSearchPage ? window.location.pathname : '') +
      (window.location.search || '?') ===
    to;

  if (!urlMatches) {
    setIsLoading(true);
    router.push(to, { scroll: false });
  } else if (canReplace) {
    setIsLoading(true);
    router.replace(to + '&_=' + Math.random(), { scroll: false });
  } else {
    setIsLoading(false);
  }
};
const updateRouteWithDebounce = debounce(updateRoute, 500);

export default function CourseProvider({
  children,
  data,
  redirectToSearchPage = false,
}: PropType) {
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

  const { sortBy, sortOrder } = useUpdatedValue<CourseSortConfig>(
    searchParams,
    () =>
      extractCourseSortConfig({
        sortBy: searchParams.get('sortBy'),
        sortOrder: searchParams.get('sortOrder'),
      })
  );

  const pendingFilterRef = useRef<Partial<FilterCourseProps>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filteredData: CourseContent['data'] = useUpdatedValue(
    [
      ...filterEntries.map(([, value]) => value.join(',')),
      data,
      sortBy,
      sortOrder,
    ],
    () =>
      data
        ? sortCourses(filterCourses(data, filterEntries), {
            sortBy,
            sortOrder,
          })
        : undefined
  );

  const updateFilter = (filter: Partial<FilterCourseProps>) => {
    Object.assign(pendingFilterRef.current, filter);
  };

  const loadData = useCallback(
    async (
      filter?: Partial<FilterCourseProps>,
      config: LoadDataConfig = {}
    ) => {
      const oldFilter = Object.fromEntries(filterEntries);
      const { shouldDebounce = false } = config;

      let { sortBy: _sortBy, sortOrder: _sortOrder } = config;
      if (!('sortBy' in config)) _sortBy = sortBy;
      if (!('sortOrder' in config)) _sortOrder = sortOrder;

      const newSortBy =
        _sortBy === DEFAULT_COURSE_SORT_BY ? undefined : _sortBy;
      const newSortOrder =
        _sortOrder === DEFAULT_COURSE_SORT_ORDER ? undefined : _sortOrder;

      const searchObj = Object.fromEntries(
        Object.entries({
          ...oldFilter,
          ...pendingFilterRef.current,
          ...filter,
        }).map(([key, value]) => [key, value?.length ? value : undefined])
      );

      Object.assign(searchObj, {
        sortBy: newSortBy,
        sortOrder: newSortOrder,
        _: undefined,
      });

      const search =
        queryString.stringify(searchObj, { useLocationSearch: true }) || '?';

      const fn = shouldDebounce ? updateRouteWithDebounce : updateRoute;
      shouldDebounce && setIsLoading(true);
      fn({
        redirectToSearchPage,
        search,
        setIsLoading,
        canReplace: !filter,
        router,
      });
    },
    [filterEntries, router, sortBy, sortOrder, redirectToSearchPage]
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
        sortBy,
        sortOrder,
        updateFilter,
        isLoading,
        loadData,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
