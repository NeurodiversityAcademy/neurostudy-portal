'use client';

import { UserProps, UserWithEmailProps } from '@/app/interfaces/User';
import getUserProfile from './getUser';
import { ReactNode, useEffect, useState } from 'react';
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
  saveData: (
    data: Record<string, unknown>,
    onSuccess?: () => void
  ) => Promise<void>;
  isEditing: boolean;
}

const [ProfileContext, useProfileContext] = deviseContext<ProfileContent>();

export { ProfileContext };
export { useProfileContext };

export default function ProfileProvider({ children }: PropType) {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<UserWithEmailProps>();
  const [courses, setCourses] = useState<MoodleCourse[]>([]);

  const [isEditing, setIsEditing] = useState<boolean>(
    () => searchParams.get('edit') === '1'
  );

  const saveData: ProfileContent['saveData'] = async (
    _data: Record<string, unknown>,
    onSuccess?: () => void
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
    const getData = async () => {
      setData(await getUserProfile());
      setIsLoading(false);
    };

    setIsLoading(true);

    getData();

    (async () => {
      const courses: MoodleCourse[] = await getMoodleCourses();
      setCourses(courses);
    })();
  }, []);

  useEffect(() => {
    const _isEditing: boolean = searchParams.get('edit') === '1';
    _isEditing !== isEditing && setIsEditing(_isEditing);
  }, [isEditing, searchParams]);

  return (
    <ProfileContext.Provider
      value={{ data, courses, isLoading, saveData, isEditing }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
