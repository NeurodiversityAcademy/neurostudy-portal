import React from 'react';
import styles from './banner.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import BadgeDisplay from '../badges/BadgeDisplay';
import CoursePrimaryFilter from '../course/CoursePrimaryFilter';
import CourseProvider from '@/app/utilities/course/CourseProvider';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import ActionButton from '../buttons/ActionButton';

interface PropType {
  displayBadges?: boolean;
  showButton?: boolean;
  displayFilter?: boolean;
  title?: string;
  subtitle?: string;
  showSearchBar?: boolean;
}

export default function HomeBanner({
  displayBadges,
  displayFilter,
  showButton,
  title,
  subtitle,
  showSearchBar = false,
}: PropType) {
  return (
    <>
      {/* Preload LCP-adjacent hero so CSS background discovers early on mobile. */}
      <link
        rel='preload'
        as='image'
        href='/images/hero-mobile.webp'
        type='image/webp'
        media='(max-width: 768px)'
        fetchPriority='high'
      />
      <link
        rel='preload'
        as='image'
        href='/images/hero-desktop.webp'
        type='image/webp'
        media='(min-width: 769px)'
        fetchPriority='high'
      />
      <div className={styles.bannerContainer}>
        <div className={styles.bannerOverlay} aria-hidden='true' />
        <div className={styles.bannerTextAndBadge}>
          <div className={styles.textContainer}>
            <Typography variant={TypographyVariant.H1} className='m-0' color='var(--GhostWhite)'>
              {title || 'We endorse Neuro-inclusion in tertiary education'}
            </Typography>
            <Typography variant={TypographyVariant.H2} color='var(--GhostWhite)'>
              {subtitle ||
                'Reach out to learn more about our endorsements and the \
              impact we are creating for Neurodivergent students.'}
            </Typography>
            {showButton && (
              <div className={styles.buttonContainer}>
                <ActionButton
                  type='button'
                  label='Learn More'
                  style={BUTTON_STYLE.Tertiary}
                  to='/endorsements'
                />
              </div>
            )}
          </div>
          {displayBadges && <BadgeDisplay />}
        </div>
        {showSearchBar && displayFilter && (
          <CourseProvider redirectToSearchPage>
            <CoursePrimaryFilter className={styles.form} />
          </CourseProvider>
        )}
      </div>
      {showSearchBar && displayFilter && (
        <CourseProvider redirectToSearchPage>
          <CoursePrimaryFilter className={styles.formMobile} />
        </CourseProvider>
      )}
    </>
  );
}
