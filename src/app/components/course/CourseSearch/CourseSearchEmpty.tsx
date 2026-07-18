'use client';

import noCoursesSrc from '@/app/images/no_courses.jpg';
import Image from 'next/image';
import Link from 'next/link';
import styles from './courseSearchEmpty.module.css';

export default function CourseSearchEmpty(): React.ReactNode {
  return (
    <div className={styles.container}>
      <Image src={noCoursesSrc} alt='No courses found.' />
      <div role='alert' className={styles.text} aria-atomic>
        Sorry, there are no results for the applied filter(s).
      </div>
      <p className={styles.helpText}>
        Need help finding a course?{' '}
        <Link href='/contact' className={styles.helpLink}>
          Contact us
        </Link>{' '}
        or explore{' '}
        <Link href='/endorsements' className={styles.helpLink}>
          endorsed providers
        </Link>
        .
      </p>
    </div>
  );
}
