'use client';

import React from 'react';
import styles from '../../CourseDetails/courseDetails.module.css';
import MapPin from '@/app/images/MapPin.png';
import Hourglass from '@/app/images/Hourglass.png';
import ClockCountdown from '@/app/images/ClockCountdown.png';
import Notebook from '@/app/images/Notebook.png';
import CurrencyCircleDollar from '@/app/images/CurrencyCircleDollar.png';
import CourseDetailsMiddleBannerIcon from './CourseDetailsMiddleBannerIcon';
import { useCourseDetailsContext } from '@/app/utilities/course/CourseDetailsProvider';

const CourseDetailsMiddleBanner: React.FC = () => {
  const { data } = useCourseDetailsContext();

  return (
    <div className={styles.middleBannerMainContainer}>
      <CourseDetailsMiddleBannerIcon
        src={MapPin}
        alt='Location'
        title={data?.Mode}
        description='Location'
      />
      <CourseDetailsMiddleBannerIcon
        src={Hourglass}
        alt='Duration'
        title={Number(data?.Duration) / 12 + ' Years'}
        description='Duration'
      />
      <CourseDetailsMiddleBannerIcon
        src={ClockCountdown}
        alt='Application End'
        title={data?.ApplicationEnd}
        description='Application End'
      />
      <CourseDetailsMiddleBannerIcon
        src={Notebook}
        alt='Subjects'
        title={data?.Subjects}
        description='Subjects'
      />
      <CourseDetailsMiddleBannerIcon
        src={CurrencyCircleDollar}
        alt='Fees'
        title={data?.Fees}
        description='Fees'
      />
    </div>
  );
};

export default CourseDetailsMiddleBanner;
