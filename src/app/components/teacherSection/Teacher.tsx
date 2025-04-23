'use client';
import React from 'react';
import styles from './teacher.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';

export default function Teacher() {
  const onRequestCheckout = async () => {
    window.open(
      'https://www.vetr.com.au/visitor_catalog_class/show/1730848',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className={styles.teacherContainer}>
      <div>
        <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
          Introduction to Neurodiversity in VET.
        </Typography>
      </div>
      <div className={styles.teacherBodyText}>
        <Typography variant={TypographyVariant.Body1} color='var(--BondBlack)'>
          Use our best in class Introduction to Neurodiversity in VET course to
          equip yourself with the tools you need to become better and you can
          improve your employability with our certificate.
        </Typography>
      </div>
      <ActionButton
        label='Enroll Now'
        style={BUTTON_STYLE.Primary}
        onClick={onRequestCheckout}
        className={'mt-4'}
      />
    </div>
  );
}
