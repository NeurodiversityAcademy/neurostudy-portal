import CourseSearch from '../components/course/CourseSearch';
import { CourseProps } from '../interfaces/Course';
import { getSearchQuery } from '../utilities/common';
import { HOST_URL } from '../utilities/constants';
import CourseProvider from '../utilities/course/CourseProvider';
import assertCourseData from '../utilities/validation/assertCourseData';
import { COURSE_FETCH_REVALIDATE_PERIOD } from '../utilities/course/constants';

const CoursesPage: React.FC<{ searchParams: Record<string, string> }> = async ({
  searchParams,
}) => {
  const query = getSearchQuery(searchParams, (value) => !Array.isArray(value));

  const data: CourseProps[] | undefined = await new Promise((resolve) => {
    fetch(HOST_URL + '/api/course' + (query ? '?' + query : ''), {
      next: { revalidate: COURSE_FETCH_REVALIDATE_PERIOD },
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
