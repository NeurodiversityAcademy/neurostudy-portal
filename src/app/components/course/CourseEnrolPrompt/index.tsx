'use client';

import React, { useEffect, useState } from 'react';
import { COURSE_ENROL_POPUP_CLOSED_KEY } from '@/app/utilities/course/constants';
import CourseBanner from './CourseBanner';
import CourseEnrolPopup from './CourseEnrolPopup';

const CourseEnrolPrompt: React.FC = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const onPopupClose = () => {
    setPopupOpen(false);
    setBannerOpen(true);
    localStorage.setItem(COURSE_ENROL_POPUP_CLOSED_KEY, '1');
  };

  const onPopupOpen = () => {
    setPopupOpen(true);
  };

  useEffect(() => {
    const open = localStorage.getItem(COURSE_ENROL_POPUP_CLOSED_KEY) !== '1';
    setPopupOpen(open);
    setBannerOpen(!open);
  }, []);

  return (
    <>
      <CourseEnrolPopup open={popupOpen} onClose={onPopupClose} />
      <CourseBanner hide={!bannerOpen} onOpen={onPopupOpen} />
    </>
  );
};

export default CourseEnrolPrompt;
