'use client';
import React from 'react';
import styles from './teacher.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import ActionButton from '../buttons/ActionButton';
// import DialogPopUp from '../popupSubscribe/DialogComponent';
import { BUTTON_STYLE } from '@/app/utilities/constants';
// import useHideOverflowEffect from '@/app/hooks/useHideOverflowEffect';

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
          Introduction to Neurodiversity in VET — PD Designed for Education
          Professionals
        </Typography>
      </div>
      <div className={styles.teacherBodyText}>
        <Typography variant={TypographyVariant.Body1} color='var(--BondBlack)'>
          As VET educators, trainers, assessors, learning designers, and
          education support staff, use our best-in-class Introduction to
          Neurodiversity in VET course to equip yourself with practical tools to
          strengthen your professional practice, build confidence in supporting
          neurodivergent learners, and enhance your employability with a
          recognised certificate.
        </Typography>
      </div>
      <ActionButton
        label='Enrol Now'
        style={BUTTON_STYLE.Primary}
        onClick={onRequestCheckout}
        className={'mt-4'}
      />
    </div>
  );
}
