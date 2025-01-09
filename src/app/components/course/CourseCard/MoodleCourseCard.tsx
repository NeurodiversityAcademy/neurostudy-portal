'use client';

import styles from './courseCard.module.css';
import cardHeaderBackgroundSrc from '@/app/images/cardHeaderBackground.jpg';
import Typography, { TypographyVariant } from '../../typography/Typography';
import Image from 'next/image';
import FavouriteIcon from '@/app/components/images/Favourite';
import Link, { LinkProps } from 'next/link';
import { MouseEvent } from 'react';
import { MoodleCourse } from '@/app/interfaces/Moodle';

interface PropType extends Omit<LinkProps, 'href'> {
  course: MoodleCourse;
}

const MoodleCourseCard: React.FC<PropType> = ({ course, ...rest }) => {
  const { href, fullname } = course;

  const institution = 'Neurodiversity Academy';

  return (
    <Link href={href} className={styles.cardLink} role='listitem' {...rest}>
      <Image
        src={cardHeaderBackgroundSrc}
        alt='Moodle Course card header background'
        className={styles.headerImg}
      />
      <div className={styles.content}>
        <div className={styles.institution}>
          <Typography
            variant={TypographyVariant.Body3}
            role='heading'
            aria-level={4}
            className={styles.institutionTitle}
          >
            <Image
              // TODO: Insert Appropriate Src / Filler
              src={cardHeaderBackgroundSrc}
              alt={`Logo of ${institution}`}
            />

            {institution}
          </Typography>

          <button
            className={styles.favouriteIcon}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
            }}
          >
            <FavouriteIcon />
          </button>
        </div>

        <Typography
          variant={TypographyVariant.Body2}
          role='heading'
          aria-level={3}
          className={styles.title}
        >
          {fullname}
        </Typography>
      </div>
    </Link>
  );
};

export default MoodleCourseCard;
