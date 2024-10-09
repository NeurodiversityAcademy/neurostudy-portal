'use client';

import Image from 'next/image';
import Loader from '../../loader/Loader';
import CourseCard from '../CourseCard';
import styles from './courseSearchResult.module.css';
import { useCourseContext } from '@/app/utilities/course/CourseProvider';
import noCoursesSrc from '@/app/images/no_courses.jpg';

const CourseSearchResult: React.FC = () => {
  const { data, isLoading } = useCourseContext();

  return (
    <section className={styles.container} aria-live='polite' role='list'>
      {data?.map((course) => (
        <CourseCard key={course.InstitutionName} course={course} />
      ))}
      {!isLoading && !data?.length && (
        <div className={styles.noResult}>
          <Image src={noCoursesSrc} alt='No courses found.' />
          <div role='alert' className={styles.noResultText} aria-atomic='true'>
            Sorry, there are no results for the applied filter(s).
          </div>
        </div>
      )}
      <Loader isLoading={isLoading} alignTop />
    </section>
  );
};

export default CourseSearchResult;
