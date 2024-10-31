'use client';

import React, { useEffect, useState } from 'react';
import CourseEnrolPrompt from './CourseEnrolPrompt';
import { COURSE_ENROL_POPUP_CLOSED_KEY } from '@/app/utilities/course/constants';
import CourseBanner from './CourseBanner';

const CourseEnrol = () => {
  const [open, setOpen] = useState(false);
  const toggleEnrolPrompt = () => {
    setOpen(!open);
    localStorage.setItem(COURSE_ENROL_POPUP_CLOSED_KEY, (+open).toString());
  };

  useEffect(() => {
    setOpen(localStorage.getItem(COURSE_ENROL_POPUP_CLOSED_KEY) !== '1');
  }, []);

  return (
    <>
      <CourseEnrolPrompt open={open} toggleEnrolPrompt={toggleEnrolPrompt} />
      {!open && <CourseBanner toggleEnrolPrompt={toggleEnrolPrompt} />}
    </>
  );
};

export default CourseEnrol;
