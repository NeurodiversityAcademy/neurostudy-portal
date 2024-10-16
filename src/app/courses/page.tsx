import CourseSearch from '../components/course/CourseSearch';
import { CourseProps } from '../interfaces/Course';
import { createMetadata, getSearchQuery } from '../utilities/common';
import { HOST_URL, META_KEY } from '../utilities/constants';
import CourseProvider from '../utilities/course/CourseProvider';
import assertCourseData from '../utilities/validation/assertCourseData';
import {
  COURSE_FETCH_REVALIDATE_PERIOD,
  COURSE_FILTER_KEYS,
  COURSE_TEST_DATA_QUERY_KEY,
} from '../utilities/course/constants';
import { MetadataProps } from '../interfaces/MetadataProps';
import { Metadata } from 'next';
import { META_COURSES_DEFAULT_CANONICAL_URL } from '../utilities/metadata/metadata';

const isQueryComplex = (searchParams: MetadataProps['searchParams']) =>
  getFetchQuery(searchParams) !== getPartialFetchQuery(searchParams);

export async function generateMetadata({
  searchParams,
}: MetadataProps): Promise<Metadata> {
  const shouldIndex = isQueryComplex(searchParams);

  const query = getPartialFetchQuery(searchParams);

  return createMetadata(META_KEY.COURSES, {
    canonical: META_COURSES_DEFAULT_CANONICAL_URL + (query ? '?' + query : ''),
    robots: { index: shouldIndex, follow: shouldIndex },
  });
}

const getFetchQuery = (searchParams: MetadataProps['searchParams']) =>
  getSearchQuery(searchParams, (key) =>
    [...COURSE_FILTER_KEYS, COURSE_TEST_DATA_QUERY_KEY].includes(key)
  );

const getPartialFetchQuery = (searchParams: MetadataProps['searchParams']) =>
  getSearchQuery(
    searchParams,
    (key, value) =>
      [...COURSE_FILTER_KEYS, COURSE_TEST_DATA_QUERY_KEY].includes(key) &&
      !Array.isArray(value)
  );

const CoursesPage: React.FC<{
  searchParams: Record<string, string | string[]>;
}> = async ({ searchParams }) => {
  // NOTE: DynamoDB is not ideal for complex queries, hence partial extraction
  const query = getPartialFetchQuery(searchParams);

  const data: CourseProps[] | undefined = await new Promise((resolve) => {
    fetch(HOST_URL + '/api/course' + (query ? '?' + query : ''), {
      next: {
        revalidate:
          process.env.NODE_ENV === 'development'
            ? 0
            : COURSE_FETCH_REVALIDATE_PERIOD,
      },
      // NOTE: Current next version 14.0.3 fails to revalidate cached data
      // properly without this. Newer versions don't require this.
      cache: 'no-store',
    })
      .then((res) => res.json())
      .then((res) => {
        assertCourseData(res);
        resolve(res);
      })
      .catch(() => resolve(undefined));
  });

  return (
    <CourseProvider data={data}>
      <CourseSearch />
    </CourseProvider>
  );
};

export default CoursesPage;
