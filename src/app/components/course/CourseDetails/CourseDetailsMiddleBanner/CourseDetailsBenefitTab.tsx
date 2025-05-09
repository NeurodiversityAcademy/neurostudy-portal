'use client';

import React, { useState } from 'react';
import styles from '../../CourseDetails/courseDetails.module.css';
import CourseDetailsBenefitTabContent from './CourseDetailsBenefitTabContent';
import Typography, { TypographyVariant } from '../../../typography/Typography';

const CourseDetailsBenefitTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('support');

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
              variant={TypographyVariant.Body2Strong}
              className={styles.benefitTabText}
            >
              Support Available
            </Typography>
          </button>
          <button
            className={activeTab === 'adjustment' ? styles.activeTab : ''}
            onClick={() => handleOnClick('adjustment')}
          >
            <Typography
              variant={TypographyVariant.Body2Strong}
              className={styles.benefitTabText}
            >
              Adjustment Available
            </Typography>
          </button>
          <button
            className={activeTab === 'jobs' ? styles.activeTab : ''}
            onClick={() => handleOnClick('jobs')}
          >
            <Typography
              variant={TypographyVariant.Body2Strong}
              className={styles.benefitTabText}
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
