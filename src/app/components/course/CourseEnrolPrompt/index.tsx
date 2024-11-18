'use client';

import React, { useEffect, useState } from 'react';
import {
  COURSE_ENROL_CACHE_STORAGE,
  COURSE_ENROL_POPUP_CLOSED_KEY,
} from '@/app/utilities/course/constants';
import CourseBanner from './CourseBanner';
import CourseEnrolPopup from './CourseEnrolPopup';
import queryString from '@/app/utilities/queryString';
import { notifyAxiosError, notifyError } from '@/app/utilities/common';
import {
  DEFAULT_STRIPE_CONCLUDING_ERROR_MESSAGE,
  DEFAULT_STRIPE_ERROR_MESSAGE,
} from '@/app/utilities/stripe/constants';
import createCheckoutUrl from '@/app/utilities/course/createCheckoutUrl';
import { CourseCheckoutSession } from '@/app/interfaces/Course';
import { useSession } from 'next-auth/react';

const CourseEnrolPrompt: React.FC = () => {
  const { data: session, status } = useSession();
  const isSessionLoading = status === 'loading';
  const [popupOpen, setPopupOpen] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    <>
      <CourseEnrolPopup
        open={popupOpen}
        isLoading={isLoading}
        onClose={onPopupClose}
        onRequestCheckout={onRequestCheckout}
      />
      <CourseBanner
        open={bannerOpen}
        isLoading={isLoading}
        onRequestCheckout={onRequestCheckout}
      />
    </>
  );
};

export default CourseEnrolPrompt;
