'use client';

import { ReactNode, useEffect } from 'react';
import { deviseContext } from '../deviseContext';
import { useSearchParams } from 'next/navigation';
import { CourseProps } from '@/app/interfaces/Course';

interface PropType {
  data: CourseProps[] | undefined;
  children: ReactNode;
}

export interface CourseContent {
  data: CourseProps[] | undefined;
  isLoading: boolean;
  loadData: (filter: CourseProps) => Promise<void>;
}

const [CourseContext, useCourseContext] = deviseContext<CourseContent>();

export { CourseContext };
export { useCourseContext };

export default function CourseProvider({ children, data }: PropType) {
  const searchParams = useSearchParams();

  // TEMP
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLoading = false;
  // TEMP
  // const [data, setData] = useState<CourseContent['data']>(_data);

  // TODO
  const loadData = async (filter: CourseProps) => {
    console.log('Entered `loadData`!', filter);
  };

  // TODO
  useEffect(() => {
    console.log('searchParams', searchParams);
  }, [searchParams]);
  // useEffect(() => {
  //   const _isEditing: boolean = searchParams.get('edit') === '1';
  //   _isEditing !== isEditing && setIsEditing(_isEditing);
  // }, [isEditing, searchParams]);

  return (
    <CourseContext.Provider value={{ data, isLoading, loadData }}>
      {children}
    </CourseContext.Provider>
  );
}
