'use client';

import { UserProps, UserWithEmailProps } from '@/app/interfaces/User';
import getUserProfile from './getUser';
import { ReactNode, Suspense, useEffect, useState } from 'react';
import saveUserProfile from './saveUserProfile';
import { notifyAxiosError, notifySuccess } from '../common';
import processProfileFormData from './processProfileFormData';
import { useSearchParams } from 'next/navigation';
import { deviseContext } from '../deviseContext';
import { MoodleCourse } from '@/app/interfaces/Moodle';
import getMoodleCourses from '../moodle/getMoodleCourses';

interface PropType {
  children: ReactNode;
}

export interface ProfileContent {
  data: UserWithEmailProps | undefined;
  courses: MoodleCourse[];
  isLoading: boolean;
  saveData: (data: Record<string, unknown>, onSuccess?: () => void) => Promise<void>;
  isEditing: boolean;
}

const [ProfileContext, useProfileContext] = deviseContext<ProfileContent>();

export { ProfileContext };
export { useProfileContext };

function ProfileProviderContent({ children }: PropType) {
  const searchParams = useSearchParams();
  const isEditing = searchParams.get('edit') === '1';

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<UserWithEmailProps>();
  const [courses, setCourses] = useState<MoodleCourse[]>([]);

  const saveData: ProfileContent['saveData'] = async (
    _data: Record<string, unknown>,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);

    try {
      const formData: UserProps = processProfileFormData(_data);

      await saveUserProfile(formData);

      const newData: UserWithEmailProps = Object.assign({}, data, formData);
      setData(newData);

      notifySuccess('Profile successfully saved.');
      onSuccess?.();
    } catch (ex) {
      notifyAxiosError(ex);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (!cancelled) {
          setData(profile);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    const loadCourses = async () => {
      const nextCourses = await getMoodleCourses();
      if (!cancelled) {
        setCourses(nextCourses);
      }
    };

    void loadProfile();
    void loadCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ data, courses, isLoading, saveData, isEditing }}>
      {children}
    </ProfileContext.Provider>
  );
}

export default function ProfileProvider({ children }: PropType) {
  return (
    <Suspense fallback={null}>
      <ProfileProviderContent>{children}</ProfileProviderContent>
    </Suspense>
  );
}
