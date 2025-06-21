import React from 'react';
import styles from './banner.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import BadgeDisplay from '../badges/BadgeDisplay';
import CoursePrimaryFilter from '../course/CoursePrimaryFilter';
import CourseProvider from '@/app/utilities/course/CourseProvider';

interface PropType {
  displayBadges?: boolean;
}

export default function HomeBanner({ displayBadges }: PropType) {
  return (
    <>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerTextAndBadge}>
          <div className={styles.textContainer}>
            <Typography
              variant={TypographyVariant.H1}
              className='m-0'
              color='var(--GhostWhite)'
            >
              We endorse Neuro-inclusion in tertiary education
            </Typography>
            <Typography
              variant={TypographyVariant.H2}
              color='var(--GhostWhite)'
            >
              Reach out to learn more about our endorsements and the impact we
              are creating for Neurodivergent students.
            </Typography>
          </div>
          {displayBadges && <BadgeDisplay />}
        </div>
        {process.env.FEATURE_ENABLE_COURSE_SEARCH === '1' && (
          <CourseProvider redirectToSearchPage>
            <CoursePrimaryFilter className={styles.form} />
          </CourseProvider>
        )}
      </div>
      {process.env.FEATURE_ENABLE_COURSE_SEARCH === '1' && (
        <CourseProvider redirectToSearchPage>
          <CoursePrimaryFilter className={styles.formMobile} />
        </CourseProvider>
      )}
    </>
  );
}
