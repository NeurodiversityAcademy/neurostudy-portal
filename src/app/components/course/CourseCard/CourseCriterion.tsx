import { CSSProperties, useId } from 'react';
import styles from './courseCriterion.module.css';
import { MAX_CRITERION_RATING } from '@/app/utilities/course/constants';

interface PropType {
  criterion: number | undefined;
  label?: string;
}

const CourseCriterion: React.FC<PropType> = ({ criterion, label }) => {
  const labelId = useId();

  if (criterion === undefined) {
    return null;
  }

  const clampedCriterion = Math.min(MAX_CRITERION_RATING, criterion);
  const floorCriterion = Math.floor(clampedCriterion);

  return (
    <div className={styles.criterionContainer}>
      <div
        role='img'
        aria-label={`Rating: ${clampedCriterion} out of ${MAX_CRITERION_RATING}`}
        aria-labelledby={labelId}
        className={styles.meter}
      >
        {Array(MAX_CRITERION_RATING)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              aria-hidden
              className={index < clampedCriterion ? styles.active : undefined}
              {...(index === floorCriterion && {
                // Runtime CSS custom property — see no-inline-styles rule exception.
                style: {
                  '--inner-percentage': (clampedCriterion - floorCriterion) * 100 + '%',
                } as CSSProperties,
              })}
            />
          ))}
      </div>
      <label id={labelId}>{label}</label>
      {/* TODO: Need an information tooltip as per design */}
    </div>
  );
};

export default CourseCriterion;
