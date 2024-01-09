import React from 'react';
import styles from './hero.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import MyAccess from '../buttons/AccessButton';

export default function Teacher() {
  return (
    <div className={styles.teacherContainer}>
      <div>
        <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
          Are you a teacher interested in Neurodiversity training?
        </Typography>
      </div>
      <div className={styles.teacherBodyText}>
        <Typography variant={TypographyVariant.Body1} color='var(--BondBlack)'>
          Use our best in class courses to equip yourself with the tools you
          need to become better and you can improve your employability with our
          certificate.
        </Typography>
      </div>
      <div>
        <MyAccess></MyAccess>
      </div>
    </div>
  );
}
