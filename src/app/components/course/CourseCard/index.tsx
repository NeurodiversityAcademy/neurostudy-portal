import { CourseProps } from '@/app/interfaces/Course';
import styles from './courseCard.module.css';
import cardHeaderBackgroundSrc from '@/app/images/cardHeaderBackground.jpg';
import Typography, { TypographyVariant } from '../../typography/Typography';
import Image from 'next/image';
import FavouriteIcon from '@/app/components/images/Favourite';
import locationSrc from '@/app/images/mapPin.svg';
import clockSrc from '@/app/images/clock.svg';
import CourseRating from './CourseRating';
import CourseCriterion from './CourseCriterion';
import { HTMLAttributes } from 'react';

interface PropType extends HTMLAttributes<HTMLDivElement> {
  course: CourseProps;
}

const CourseCard: React.FC<PropType> = ({ course, ...rest }) => {
  const { InstitutionName, Title, Location, Duration, Rating, Criteria, Tier } =
    course;

  const _years: number | undefined = Duration ? Duration / 12 : undefined;
  const years =
    _years && (_years % 1 === 0 ? _years.toString() : _years.toFixed(1));

  return (
    <div className={styles.container} role='listbox' {...rest}>
      <Image
        src={cardHeaderBackgroundSrc}
        alt='Course card header background'
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
              alt={`Logo of ${InstitutionName}`}
            />

            {InstitutionName}
          </Typography>

          <button className={styles.favouriteIcon}>
            <FavouriteIcon />
          </button>
        </div>

        <Typography
          variant={TypographyVariant.Body2}
          role='heading'
          aria-level={3}
          className={styles.title}
        >
          {Title}
        </Typography>

        <div className={styles.timeLocation}>
          <Typography variant={TypographyVariant.Body2}>
            <Image src={locationSrc} alt='Location Icon' />
            {Location}
          </Typography>
          {years && (
            <Typography variant={TypographyVariant.Body2}>
              <Image src={clockSrc} alt='Clock Icon' />
              {years} Year{_years > 1 && 's'}
            </Typography>
          )}
        </div>
        <CourseRating Rating={Rating} Tier={Tier} />
        <CourseCriterion criterion={Criteria?.Faculty} label='Faculty' />
      </div>
    </div>
  );
};

export default CourseCard;
