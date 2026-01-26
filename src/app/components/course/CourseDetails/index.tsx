'use client';

import React, { useEffect, useState } from 'react';
import CourseDetailsTopBanner from './CourseDetailsTopBanner/CourseDetailsTopBanner';
import CourseDetailsBenefitTab from './CourseDetailsMiddleBanner/CourseDetailsBenefitTab';
import CourseDetailsBody from './CourseDetailsBody/CourseDetailsBody';
import CourseDetailsProvider from '@/app/utilities/course/CourseDetailsProvider';
import { CourseDetailsProps as CourseDetailsType } from '@/app/interfaces/Course';

interface CourseDetailsProps {
  id: string;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ id }) => {
  const [courseDetails, setCourseDetails] = useState<
    CourseDetailsType | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);

  // Fetch full course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`/api/course/details?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setCourseDetails(data);
        }
      } catch (error) {
        console.error('Failed to fetch course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!courseDetails) {
    return <div>Course not found</div>;
  }

  return (
    <CourseDetailsProvider data={courseDetails}>
      <CourseDetailsTopBanner />
      <CourseDetailsBenefitTab />
      <CourseDetailsBody />
    </CourseDetailsProvider>
  );
};

export default CourseDetails;
