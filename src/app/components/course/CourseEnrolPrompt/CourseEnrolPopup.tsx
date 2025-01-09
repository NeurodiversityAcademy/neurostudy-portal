'use client';

import React from 'react';
import Dialog from '../../dialog';
import Image from 'next/image';
import introCoursePopupSrc from '@/app/images/intro-course-popup.jpg';
import ActionButton from '../../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import Loader from '../../loader/Loader';
import styles from './courseEnrolPrompt.module.css';
import { CourseEnrolPopupProps } from '@/app/interfaces/Course';

export default function CourseEnrolPopup({
  open,
  isLoading,
  onClose,
  onRequestCheckout,
}: CourseEnrolPopupProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Image
        src={introCoursePopupSrc}
        alt='Introduction to Neurodiversity - Course Enrolment Popup'
        className={styles.popupImg}
      />
      {open && (
        <div className={styles.enrolBtnContainer}>
          <Loader isLoading={isLoading} className={styles.loader} />
          <ActionButton
            style={BUTTON_STYLE.Primary}
            label='Enrol Now'
            className={styles.enrolBtn}
            disabled={isLoading}
            onClick={onRequestCheckout}
          />
        </div>
      )}
    </Dialog>
  );
}
