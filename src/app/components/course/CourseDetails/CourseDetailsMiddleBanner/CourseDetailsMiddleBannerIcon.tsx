import React from 'react';
import styles from '../../CourseDetails/courseDetails.module.css';
import Image, { StaticImageData } from 'next/image';
import Typography, { TypographyVariant } from '../../../typography/Typography';
import useWindowWidth from '@/app/hooks/useWindowWidth';

interface CourseDetailMiddleBannerIconProps {
  src: StaticImageData;
  alt: string;
  title?: string;
  description?: string;
}

const CourseDetailsMiddleBannerIcon: React.FC<
  CourseDetailMiddleBannerIconProps
> = ({ src, alt, title, description }) => {
  const windowWidth = useWindowWidth();

  return (
    <div className={styles.middleBannerIconContainer}>
      <div className={styles.middleBannerIconImageWrapper}>
        <Image {...{ src, alt }} />
      </div>
      <Typography
        variant={
          windowWidth > 800 ? TypographyVariant.Body1 : TypographyVariant.Body2
        }
      >
        {title}
      </Typography>
      <Typography variant={TypographyVariant.Body3}>{description}</Typography>
    </div>
  );
};

export default CourseDetailsMiddleBannerIcon;
