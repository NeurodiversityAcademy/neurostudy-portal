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

  criterion = Math.min(MAX_CRITERION_RATING, criterion);
  const floorCriterion = Math.floor(criterion);

  return (
    <div className={styles.criterionContainer}>
      <div
        role='img'
        aria-label={`Rating: ${criterion} out of ${MAX_CRITERION_RATING}`}
        aria-labelledby={labelId}
        className={styles.meter}
      >
        {Array(MAX_CRITERION_RATING)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              aria-hidden
              className={index < criterion ? styles.active : undefined}
              {...(index === floorCriterion && {
                style: {
                  '--inner-percentage':
                    (criterion - floorCriterion) * 100 + '%',
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
