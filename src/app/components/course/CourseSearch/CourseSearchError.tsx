'use client';

import { BUTTON_STYLE } from '@/app/utilities/constants';
import ActionButton from '../../buttons/ActionButton';
import Typography, { TypographyVariant } from '../../typography/Typography';
import styles from './courseSearchError.module.css';

export default function CourseSearchError({
  reset,
}: {
  reset: () => void;
}): React.ReactNode {
  return (
    <div role='alert' className={styles.container} aria-atomic>
      <Typography variant={TypographyVariant.H3}>
        Failed to fetch the list of courses.
      </Typography>
      <ActionButton
        style={BUTTON_STYLE.Secondary}
        label='Try again'
        onClick={reset}
      />
    </div>
  );
}
