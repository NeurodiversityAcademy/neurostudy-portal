'use client';

import noCoursesSrc from '@/app/images/no_courses.jpg';
import Image from 'next/image';
import styles from './courseSearchResult.module.css';

export default function CourseSearchEmpty(): React.ReactNode {
  return (
    <div className={styles.alert}>
      <Image src={noCoursesSrc} alt='No courses found.' />
      <div role='alert' className={styles.noResultText} aria-atomic>
        Sorry, there are no results for the applied filter(s).
      </div>
    </div>
  );
}
