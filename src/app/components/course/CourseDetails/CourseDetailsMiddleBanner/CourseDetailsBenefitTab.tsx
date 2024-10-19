'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '../../CourseDetails/courseDetails.module.css';
import CourseDetailsBenefitTabContent from './CourseDetailsBenefitTabContent';
import Typography, { TypographyVariant } from '../../../typography/Typography';
import useWindowWidth from '@/app/hooks/useWindowWidth';

const CourseDetailsBenefitTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('support');
  const currentButtonRef = useRef<HTMLButtonElement | null>(null);
  const windowWidth = useWindowWidth();

  const handleOnClick = (
    tab: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (currentButtonRef.current) {
      currentButtonRef.current.style.borderBottom = 'none';
      currentButtonRef.current.style.background = 'none';
    }

    currentButtonRef.current = e.currentTarget;

    currentButtonRef.current.style.borderBottom = '3px solid var(--cherryPie)';
    currentButtonRef.current.style.background = 'var(--GhostWhiteVariant)';

    setActiveTab(tab);
  };

  useEffect(() => {
    const firstButton = document.getElementById(
      'supportButton'
    ) as HTMLButtonElement;

    if (firstButton) {
      currentButtonRef.current = firstButton;
      firstButton.style.borderBottom = '3px solid var(--cherryPie)';
      firstButton.style.color = 'var(--cherryPie)';
      firstButton.style.background = 'var(--GhostWhiteVariant)';
    }
  }, []);

  return (
    <div>
      <div className={styles.benefitTabContainer}>
        <Typography
          variant={TypographyVariant.H3}
          className={styles.benefitTabContainerTitle}
          color={`var(--GhostWhiteVariant)`}
        >
          Benefits of this course
        </Typography>
        <div className={styles.benefitTabContainerTabTitleGroup}>
          <button
            id='supportButton'
            onClick={(e) => handleOnClick('support', e)}
          >
            <Typography
              variant={
                windowWidth > 800
                  ? TypographyVariant.Body2Strong
                  : TypographyVariant.Body3Strong
              }
              color={
                activeTab === 'support'
                  ? 'var(--cherryPie)'
                  : 'var(--BondBlack)'
              }
            >
              Support Available
            </Typography>
          </button>
          <button
            id='adjustmentButton'
            onClick={(e) => handleOnClick('adjustment', e)}
          >
            <Typography
              variant={
                windowWidth > 800
                  ? TypographyVariant.Body2Strong
                  : TypographyVariant.Body3Strong
              }
              color={
                activeTab === 'adjustment'
                  ? 'var(--cherryPie)'
                  : 'var(--BondBlack)'
              }
            >
              Adjustment Available
            </Typography>
          </button>
          <button id='jobsButton' onClick={(e) => handleOnClick('jobs', e)}>
            <Typography
              variant={
                windowWidth > 800
                  ? TypographyVariant.Body2Strong
                  : TypographyVariant.Body3Strong
              }
              color={
                activeTab === 'jobs' ? 'var(--cherryPie)' : 'var(--BondBlack)'
              }
            >
              Possible Job Requirements
            </Typography>
          </button>
        </div>
        <div className={styles.benefitTabContainerTabContentContainer}>
          <CourseDetailsBenefitTabContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsBenefitTab;
