import React from 'react';
import CourseDetailsTopBanner from './CourseDetailsTopBanner/CourseDetailsTopBanner';
import CourseDetailsMiddleBanner from './CourseDetailsMiddleBanner/CourseDetailsMiddleBanner';
import CourseDetailsBenefitTab from './CourseDetailsMiddleBanner/CourseDetailsBenefitTab';
import CourseDetailsBody from './CourseDetailsBody/CourseDetailsBody';
import courseData from '../../../../app/courses/courseData.json';
import CourseDetailsProvider from '@/app/utilities/course/CourseDetailsProvider';

interface CourseDetailsProps {
  id: string;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ id }) => {
  const { courses } = courseData;
  const course = courses.find(({ CourseId }) => CourseId === id);

  return (
    <CourseDetailsProvider data={course}>
      <CourseDetailsTopBanner />
      <CourseDetailsMiddleBanner />
      <CourseDetailsBenefitTab />
      <CourseDetailsBody />
    </CourseDetailsProvider>
  );
};

export default CourseDetails;
