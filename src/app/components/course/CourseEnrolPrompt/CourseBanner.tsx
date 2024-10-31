'use client';

import React from 'react';
import Image from 'next/image';
import IntroCourseBanner from '@/app/images/intro-course-banner.jpg';
import styles from './courseEnrolPrompt.module.css';
import ActionButton from '../../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import classNames from 'classnames';

export default function CourseBanner({
  hide,
  onOpen,
}: {
  hide: boolean;
  onOpen: () => void;
}) {
  return (
    <>
      <Image
        src={IntroCourseBanner}
        alt='Neurodiversity Academy Course'
        className={classNames(styles.courseBanner, hide && styles.hide)}
      />
      <div
        className={classNames(styles.seeMoreBtnContainer, hide && styles.hide)}
      >
        <ActionButton
          style={BUTTON_STYLE.Primary}
          label='See More'
          className={styles.seeMoreBtn}
          onClick={onOpen}
        />
      </div>
    </>
  );
}
