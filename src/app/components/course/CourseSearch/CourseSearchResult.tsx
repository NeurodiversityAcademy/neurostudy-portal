'use client';

import Loader from '../../loader/Loader';
import CourseCard from '../CourseCard';
import styles from './courseSearchResult.module.css';
import { useCourseContext } from '@/app/utilities/course/CourseProvider';
import CourseSearchError from './CourseSearchError';
import CourseSearchEmpty from './CourseSearchEmpty';
import Typography, { TypographyVariant } from '../../typography/Typography';
import CourseSearchSort from './CourseSearchSort';

const CourseSearchResult: React.FC = () => {
  const { data, isLoading, loadData } = useCourseContext();

  return (
    <section className={styles.container} aria-live='polite' role='list'>
      {data && (
        <div className={styles.header}>
          <Typography
            variant={TypographyVariant.Body1}
            role='status'
            aria-atomic
          >
            {data.length} Course{data.length > 1 ? 's' : ''} Found
          </Typography>
          <CourseSearchSort />
        </div>
      )}
      {data?.map((course) => (
        <CourseCard key={course.CourseId} course={course} />
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
