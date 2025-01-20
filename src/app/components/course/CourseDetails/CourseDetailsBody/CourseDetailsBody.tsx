'use client';

import React from 'react';
import CourseDetailsBodySideNav from './CourseDetailsBodySideNav';
import styles from '../../CourseDetails/courseDetails.module.css';
import { useCourseDetailsContext } from '@/app/utilities/course/CourseDetailsProvider';
import CourseDetailsBodyText from './CourseDetailsBodyText';

const CourseDetailsBody: React.FC = () => {
  const { data } = useCourseDetailsContext();

  const sections = [
    { id: 'courseOverview', title: 'Course Overview', data: data?.Overview },
    { id: 'courseStructure', title: 'Course Structure', data: data?.Structure },
    {
      id: 'entryRequirements',
      title: 'Entry Requirements',
      data: data?.EntryRequirements,
    },
    { id: 'tuitionFees', title: 'Tuition & Fees', data: data?.TuitionsAndFees },
    {
      id: 'careerOpportunities',
      title: 'Career Opportunities',
      data: data?.CareerOpportunities,
    },
    {
      id: 'creditForPreviousStudy',
      title: 'Credits For Previous Study',
      data: data?.PreviousCredits,
    },
    { id: 'keyCodes', title: 'Key Codes (Cricos)', data: data?.KeyCodes },
    {
      id: 'aboutUniversity',
      title: 'About the University',
      data: data?.AboutUniversity,
    },
    { id: 'faq', title: 'FAQs', data: data?.FAQS },
  ];

  return (
    <div className={styles.courseDetailsBodyContainer}>
      <CourseDetailsBodySideNav sections={sections} />
      <div className={styles.courseDetailsBodyTextContainer}>
        {sections.map((section, index) => (
          <CourseDetailsBodyText
            key={index}
            id={section.id}
            data={section.data}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseDetailsBody;
