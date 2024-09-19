import { ReactNode } from 'react';
import styles from './profileAttribute.module.css';
import Typography, { TypographyVariant } from '../../typography/Typography';
import ProfileEmptyDescription from './ProfileEmptyDescription';

interface Props {
  label: string;
  value: string | number | boolean | unknown[] | undefined;
}

export default function ProfileAttribute({
  label,
  value: _value,
}: Props): ReactNode {
  const value = ((val) => {
    if (typeof val === 'boolean') {
      return val ? 'Yes' : 'No';
    }

    if (val) {
      if (Array.isArray(val)) {
        return val.join(', ');
      }
      return val.toString();
    }

    return null;
  })(_value);

  return (
    <div className={styles.info}>
      <label className={styles.label}>{label}</label>
      <Typography variant={TypographyVariant.Body2}>
        {value || <ProfileEmptyDescription />}
      </Typography>
    </div>
  );
}
