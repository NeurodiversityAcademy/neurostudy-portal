'use client';

import React from 'react';
import styles from '../../CourseDetails/courseDetails.module.css';
import Typography, { TypographyVariant } from '../../../typography/Typography';
import classNames from 'classnames';
import Image from 'next/image';
import Logo from '@/app/images/Logo-navbar.svg';
import ActionButton from '../../../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import { useCourseDetailsContext } from '@/app/utilities/course/CourseDetailsProvider';
import useWindowWidth from '@/app/hooks/useWindowWidth';

const CourseDetailsTopBanner: React.FC = () => {
  const { data } = useCourseDetailsContext();
  const windowWidth = useWindowWidth();

  return (
    <div className={classNames('row', styles.topBannerMainContainer)}>
      <div
        className={classNames(
          { 'col-md-7': windowWidth > 768 },
          { 'col-md-12': windowWidth <= 820 }
        )}
      >
        <div
          className={classNames('col-md-12', styles.topBannerInstituteTitle)}
        >
          <div className={styles.topBannerInstituteLogo}>
            {/* replace the src */}
            <Image src={Logo} alt='logo' />
          </div>
          <span className='mx-2'>{data?.InstitutionName}</span>
        </div>
        <div className={classNames('col-md-12', styles.topBannerCourseTitle)}>
          <Typography variant={TypographyVariant.H1}>{data?.Title}</Typography>
          <Typography variant={TypographyVariant.H2}>
            {data?.Subtitle}
          </Typography>
          <Typography variant={TypographyVariant.Body1}>
            {data?.Description}
          </Typography>
        </div>
      </div>
      <div
        className={classNames(
          { 'col-md-5': windowWidth > 768 },
          { 'col-md-10': windowWidth > 500 && windowWidth <= 820 },
          { 'col-md-12': windowWidth <= 500 }
        )}
      >
        <div className={classNames('row', styles.topBannerAdmissions)}>
          <Typography variant={TypographyVariant.Body1}>
            2024 Admissions are open now
          </Typography>
          <Typography
            variant={TypographyVariant.Body3}
            className={styles.topBannerAdmissionsDesc}
          >
            Get started today or request more info about the MADS degree.
          </Typography>
          <div className={styles.topBannerAdmissionsBtnGroup}>
            <ActionButton
              type='submit'
              label='Apply Now'
              style={BUTTON_STYLE.Primary}
              className={styles.topBannerAdmissionsApplyNowBtn}
            />
            <ActionButton
              type='submit'
              label='Shortlist'
              style={BUTTON_STYLE.Secondary}
              className={styles.topBannerAdmissionsShortlistBtn}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsTopBanner;
