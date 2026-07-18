import React from 'react';
import Image from 'next/image';
import styles from './banner.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import BadgeDisplay from '../badges/BadgeDisplay';
import CoursePrimaryFilter from '../course/CoursePrimaryFilter';
import CourseProvider from '@/app/utilities/course/CourseProvider';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import ActionButton from '../buttons/ActionButton';
import heroBackground from '@/app/images/bg-hero.webp';

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
      <div className={styles.bannerContainer}>
        <Image
          src={heroBackground}
          alt=''
          fill
          priority
          fetchPriority='high'
          sizes='100vw'
          quality={75}
          className={styles.bannerBackground}
        />
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
          {displayBadges && <BadgeDisplay priority />}
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
