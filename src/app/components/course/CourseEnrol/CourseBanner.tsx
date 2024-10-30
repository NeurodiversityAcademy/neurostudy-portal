'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import IntroCourseBanner from '@/app/images/intro-course-banner.jpg';
import styles from './courseEnrol.module.css';
import ActionButton from '../../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import Loader from '../../loader/Loader';
import { CourseBannerSection } from '@/app/interfaces/Course';

const CourseBanner: React.FC<Partial<CourseBannerSection>> = ({
  toggleEnrolPrompt,
}) => {
  const [isLoading] = useState(false);

  return (
    <>
      <Image
        src={IntroCourseBanner}
        alt='Neurodiversity Academy Course'
        className={styles.courseBanner}
      />
      <div className={styles.seeMoreBtnContainer}>
        <Loader isLoading={isLoading} className={styles.loader} />
        <ActionButton
          style={BUTTON_STYLE.Primary}
          label='See More'
          className={styles.seeMoreBtn}
          disabled={isLoading}
          onClick={toggleEnrolPrompt}
        />
      </div>
    </>
  );
};

export default CourseBanner;
