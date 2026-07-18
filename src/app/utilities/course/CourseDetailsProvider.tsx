'use client';

import { ReactNode, useEffect, useState } from 'react';
import { deviseContext } from '../deviseContext';
import { CourseDetailsProps } from '@/app/interfaces/Course';

interface PropType {
  data: CourseDetailsProps | undefined;
  children: ReactNode;
}

export interface CourseDetailsContent {
  data: CourseDetailsProps | undefined;
  isLoading: boolean;
}

const [CourseDetailsContext, useCourseDetailsContext] = deviseContext<CourseDetailsContent>();

export { CourseDetailsContext };
export { useCourseDetailsContext };

export default function CourseDetailsProvider({ children, data }: PropType) {
  const [isLoading, setIsLoading] = useState(false);
  const [prevData, setPrevData] = useState(data);

  if (data !== prevData) {
    setPrevData(data);
    setIsLoading(false);
  }

  useEffect(() => {
    const onPopState = () => setIsLoading(true);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <CourseDetailsContext.Provider
      value={{
        data,
        isLoading,
      }}
    >
      {children}
    </CourseDetailsContext.Provider>
  );
}
