import { CourseProps } from '@/app/interfaces/Course';
import StarPercentage from '../../images/StarPercentage';
import { useId } from 'react';
import styles from './courseRating.module.css';
import logoSmallSrc from '@/app/images/logoSmall.png';
import Image from 'next/image';
import classNames from 'classnames';
import { processTier } from '@/app/utilities/course/processTier';
import { MAX_COURSE_RATING } from '@/app/utilities/course/constants';

interface PropType {
  Rating: CourseProps['Rating'];
  Tier?: CourseProps['Tier'];
}

const CourseRating: React.FC<PropType> = ({ Rating, Tier }) => {
  const labelId = useId();

  if (Rating === undefined) {
    return null;
  }

  Rating = Math.min(MAX_COURSE_RATING, Rating);
  const floorRating = Math.floor(Rating);

  Tier = processTier(Tier);

  return (
    <div className={styles.ratingContainer}>
      <label id={labelId}>{Rating.toFixed(1)}</label>
      <div
        role='img'
        aria-label={`Rating: ${Rating} out of ${MAX_COURSE_RATING}`}
        aria-labelledby={labelId}
      >
        {Array(floorRating)
          .fill(0)
          .map((_, index) => (
            <StarPercentage key={index} aria-hidden />
          ))}
        {Rating - floorRating ? (
          <StarPercentage
            percentage={(Rating - floorRating) * 100}
            aria-hidden
          />
        ) : null}
      </div>
      {Tier && (
        <div className={classNames(styles.tier, styles[Tier.toLowerCase()])}>
          <Image
            src={logoSmallSrc}
            alt='Neurodiversity Academy Logo (Small)'
            width={20}
          />
          <span>{Tier}</span>
        </div>
      )}
    </div>
  );
};

export default CourseRating;
