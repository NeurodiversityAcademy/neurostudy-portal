'use client';

import React, { useState } from 'react';
import styles from '../../CourseDetails/courseDetails.module.css';
import CourseDetailsBenefitTabContent from './CourseDetailsBenefitTabContent';
import Typography, { TypographyVariant } from '../../../typography/Typography';
import useWindowWidth from '@/app/hooks/useWindowWidth';

const CourseDetailsBenefitTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('support');
  const windowWidth = useWindowWidth();

  const handleOnClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <section>
      <div className={styles.benefitTabContainer}>
        <Typography
          variant={TypographyVariant.H3}
          className={styles.benefitTabContainerTitle}
          color={`var(--GhostWhiteVariant)`}
        >
          Benefits of this course
        </Typography>
        <div className={styles.benefitTabTitleGroup}>
          <button
            className={activeTab === 'support' ? styles.activeTab : ''}
            onClick={() => handleOnClick('support')}
          >
            <Typography
              variant={
                windowWidth > 800
                  ? TypographyVariant.Body2Strong
                  : TypographyVariant.Body3Strong
              }
            >
              Support Available
            </Typography>
          </button>
          <button
            className={activeTab === 'adjustment' ? styles.activeTab : ''}
            onClick={() => handleOnClick('adjustment')}
          >
            <Typography
              variant={
                windowWidth > 800
                  ? TypographyVariant.Body2Strong
                  : TypographyVariant.Body3Strong
              }
            >
              Adjustment Available
            </Typography>
          </button>
          <button
            className={activeTab === 'jobs' ? styles.activeTab : ''}
            onClick={() => handleOnClick('jobs')}
          >
            <Typography
              variant={
                windowWidth > 800
                  ? TypographyVariant.Body2Strong
                  : TypographyVariant.Body3Strong
              }
            >
              Possible Job Requirements
            </Typography>
          </button>
        </div>
        <div className={styles.benefitTabContentContainer}>
          <CourseDetailsBenefitTabContent activeTab={activeTab} />
        </div>
      </div>
    </section>
  );
};

export default CourseDetailsBenefitTab;
