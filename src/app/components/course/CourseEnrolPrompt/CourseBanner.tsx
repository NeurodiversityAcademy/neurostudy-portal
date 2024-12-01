'use client';

import React from 'react';
import Image from 'next/image';
import introCourseBannerSrc from '@/app/images/intro-course-banner.jpg';
import styles from './courseEnrolPrompt.module.css';
import ActionButton from '../../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import classNames from 'classnames';
import Loader from '../../loader/Loader';
import { CourseBannerProps } from '@/app/interfaces/Course';

export default function CourseBanner({
  open,
  isLoading,
  onRequestCheckout,
}: CourseBannerProps) {
  return (
    <div className={styles.courseBannerContainer}>
      <Image
        src={introCourseBannerSrc}
        alt='Neurodiversity Academy Course'
        className={classNames(styles.courseBanner, !open && styles.hide)}
      />
      <div
        className={classNames(
          styles.bannerEnrolBtnContainer,
          !open && styles.hide
        )}
      >
        <Loader isLoading={isLoading} className={styles.loader} />
        <ActionButton
          style={BUTTON_STYLE.Primary}
          disabled={isLoading}
          label='Enrol'
          onClick={onRequestCheckout}
        />
      </div>
    </div>
  );
}
