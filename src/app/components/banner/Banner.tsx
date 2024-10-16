import React from 'react';
import styles from './banner.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import BadgeDisplay from '../badges/BadgeDisplay';
import CoursePrimaryFilter from '../course/CoursePrimaryFilter';
import CourseProvider from '@/app/utilities/course/CourseProvider';

export default function Banner() {
  return (
    <>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerTextAndBadge}>
          <div className={styles.textContainer}>
            <div className={styles.textHeader}>
              <Typography
                variant={TypographyVariant.H1}
                color='var(--GhostWhite)'
              >
                We endorse Neuro-inclusion in higher education
              </Typography>
            </div>
            <div className={styles.textBody}>
              <Typography
                variant={TypographyVariant.H2}
                color='var(--GhostWhite)'
              >
                Reach out to learn more about our endorsements and the impact we
                are creating for Neurodivergent students.
              </Typography>
            </div>
          </div>
          <div>
            <BadgeDisplay></BadgeDisplay>
          </div>
        </div>
        {process.env.FEATURE_ENABLE_COURSE_SEARCH === '1' && (
          <CourseProvider redirectToSearchPage>
            <CoursePrimaryFilter className={styles.form} />
          </CourseProvider>
        )}
      </div>
    </>
  );
}
