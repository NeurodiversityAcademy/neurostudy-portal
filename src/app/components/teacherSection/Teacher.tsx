'use client';
import React, { useEffect, useState } from 'react';
import styles from './teacher.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import ActionButton from '../buttons/ActionButton';
// import DialogPopUp from '../popupSubscribe/DialogComponent';
import { BUTTON_STYLE } from '@/app/utilities/constants';
// import useHideOverflowEffect from '@/app/hooks/useHideOverflowEffect';
import { CourseCheckoutSession } from '@/app/interfaces/Course';
import { notifyError, notifyAxiosError } from '@/app/utilities/common';
import {
  COURSE_ENROL_CACHE_STORAGE,
  COURSE_ENROL_POPUP_CLOSED_KEY,
} from '@/app/utilities/course/constants';
import createCheckoutUrl from '@/app/utilities/course/createCheckoutUrl';
import queryString from '@/app/utilities/queryString';
import {
  DEFAULT_STRIPE_CONCLUDING_ERROR_MESSAGE,
  DEFAULT_STRIPE_ERROR_MESSAGE,
} from '@/app/utilities/stripe/constants';
import { useSession } from 'next-auth/react';
// import CourseBanner from '../course/CourseEnrolPrompt/CourseBanner';

export default function Teacher() {
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const toggleModal = useCallback(() => {
  //   setIsModalOpen(!isModalOpen);
  // }, [isModalOpen]);

  // const hideOverflow = useHideOverflowEffect();

  // useEffect(() => {
  //   if (isModalOpen) {
  //     return hideOverflow();
  //   }
  // }, [isModalOpen, hideOverflow]);

  const { data: session, status } = useSession();
  const isSessionLoading = status === 'loading';
  const [, setPopupOpen] = useState(false);
  const [, setBannerOpen] = useState(false);
  const [, setIsLoading] = useState(false);
  const onPopupClose = () => {
    setPopupOpen(false);
    setBannerOpen(true);
    window[COURSE_ENROL_CACHE_STORAGE].setItem(
      COURSE_ENROL_POPUP_CLOSED_KEY,
      '1'
    );
  };

  useEffect(() => {
    const searchObj = queryString.parse();

    if (
      ['failure', 'canceled'].includes(searchObj['checkout_status']?.toString())
    ) {
      setTimeout(() => {
        const { error } = searchObj;
        notifyError(
          error
            ? error + ' ' + DEFAULT_STRIPE_CONCLUDING_ERROR_MESSAGE
            : DEFAULT_STRIPE_ERROR_MESSAGE,
          {
            duration: -1,
          }
        );
      });
      return;
    }

    setBannerOpen(true);

    if (isSessionLoading || !!session) {
      return;
    }

    const open =
      window[COURSE_ENROL_CACHE_STORAGE].getItem(
        COURSE_ENROL_POPUP_CLOSED_KEY
      ) !== '1';
    setPopupOpen(open);
  }, [session, isSessionLoading]);

  const onRequestCheckout = async () => {
    setIsLoading(true);
    try {
      const res: CourseCheckoutSession = await createCheckoutUrl();
      const { url } = res;
      if (url) {
        onPopupClose();
        window.location.href = url;
      }
    } catch (err) {
      notifyAxiosError(err);
    } finally {
      setIsLoading(false);
    }
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
