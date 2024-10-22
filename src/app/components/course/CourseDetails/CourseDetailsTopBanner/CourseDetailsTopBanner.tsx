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
import CourseDetailsMiddleBanner from '../CourseDetailsMiddleBanner/CourseDetailsMiddleBanner';

const CourseDetailsTopBanner: React.FC = () => {
  const { data } = useCourseDetailsContext();
  const windowWidth = useWindowWidth();

  return (
    <div className={classNames('row', styles.topBannerMainContainer)}>
      <div
        className={classNames(
          { 'col-md-7': windowWidth > 1000 },
          { 'col-md-12': windowWidth <= 1000 }
        )}
      >
        <div
          className={classNames('col-md-12', styles.topBannerInstituteTitle)}
        >
          <div className={styles.topBannerInstituteLogo}>
            {/*TODO: replace the src */}
            <Image src={Logo} alt='logo' />
          </div>
          <Typography variant={TypographyVariant.Body1} className='mx-2'>
            {data?.InstitutionName}
          </Typography>
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
          { 'col-md-5': windowWidth > 1000 },
          { 'col-md-12': windowWidth <= 1000 }
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
          <div className={classNames(styles.topBannerAdmissionsBtnGroup)}>
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
      <CourseDetailsMiddleBanner />
    </div>
  );
};

export default CourseDetailsTopBanner;
