import { ReactNode } from 'react';
import styles from './profileAttribute.module.css';
import Typography, { TypographyVariant } from '../../typography/Typography';
import ProfileEmptyDescription from './ProfileEmptyDescription';

interface Props {
  label: string;
  value: string | number | unknown[] | undefined;
}

export default function ProfileAttribute({
  label,
  value: _value,
}: Props): ReactNode {
  const value = _value
    ? Array.isArray(_value)
      ? _value.join(', ')
      : _value.toString()
    : null;

  return (
    <div className={styles.info}>
      <label className={styles.label}>{label}</label>
      <Typography variant={TypographyVariant.Body2}>
        {value || <ProfileEmptyDescription />}
      </Typography>
    </div>
  );
}
