'use client';

import React, { useState } from 'react';
import Dialog from '../../dialog';
import Image from 'next/image';
import introCoursePopupSrc from '@/app/images/intro-course-popup.jpg';
import ActionButton from '../../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import styles from './courseEnrolPrompt.module.css';
import createCheckoutUrl from '@/app/utilities/course/createCheckoutUrl';
import { CourseCheckoutSession } from '@/app/interfaces/Course';
import Loader from '../../loader/Loader';

export default function CourseEnrolPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    onClose();
    setIsLoading(true);

    const res: CourseCheckoutSession = await createCheckoutUrl();
    const { url } = res;
    if (url) {
      window.location.href = url;
    } else {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <Image
          src={introCoursePopupSrc}
          alt='Introduction to Neurodiversity - Course Enrolment Popup'
          className={styles.popupImg}
        />
      </Dialog>
      {open && (
        <div className={styles.enrolBtnContainer}>
          <Loader isLoading={isLoading} className={styles.loader} />
          <ActionButton
            style={BUTTON_STYLE.Primary}
            label='Enrol Now'
            className={styles.enrolBtn}
            disabled={isLoading}
            onClick={onClick}
          />
        </div>
      )}
    </>
  );
}
