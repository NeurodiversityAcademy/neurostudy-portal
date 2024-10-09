'use client';

import Loader from '../../loader/Loader';
import CourseCard from '../CourseCard';
import styles from './courseSearchResult.module.css';
import { useCourseContext } from '@/app/utilities/course/CourseProvider';
import CourseSearchError from './CourseSearchError';
import CourseSearchEmpty from './CourseSearchEmpty';

const CourseSearchResult: React.FC = () => {
  const { data, isLoading, loadData } = useCourseContext();

  return (
    <section className={styles.container} aria-live='polite' role='list'>
      {data?.map((course) => (
        <CourseCard key={course.InstitutionName} course={course} />
      ))}
      {!isLoading &&
        (data === undefined ? (
          <CourseSearchError reset={() => loadData()} />
        ) : (
          !data.length && <CourseSearchEmpty />
        ))}
      <Loader isLoading={isLoading} alignTop />
    </section>
  );
};

export default CourseSearchResult;
