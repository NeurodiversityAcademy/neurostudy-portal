'use client';

import { UserProps, UserWithEmailProps } from '@/app/interfaces/User';
import getUserProfile from './getUser';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import saveUserProfile from './saveUserProfile';
import { getAxiosErrorMessage, notifyError, notifySuccess } from '../common';
import processProfileFormData from './processProfileFormData';
import { useSearchParams } from 'next/navigation';

interface PropType {
  children: ReactNode;
}

export interface ProfileContent {
  data: UserWithEmailProps | undefined;
  isLoading: boolean;
  saveData: (_data: Record<string, unknown>) => void;
  isEditing: boolean;
}

export const ProfileContext = createContext<ProfileContent | undefined>(
  undefined
);

export const useProfileContext = () => {
  const context = useContext(
    ProfileContext as React.Context<ProfileContent | undefined>
  );
  if (!context) {
    throw new Error('useProfileContext does not have proper context.');
  }
  return context;
};

export default function ProfileProvider({ children }: PropType) {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<UserWithEmailProps>();

  const [isEditing, setIsEditing] = useState<boolean>(
    () => searchParams.get('edit') === '1'
  );

  const saveData = async (_data: Record<string, unknown>) => {
    setIsLoading(true);

    try {
      const formData: UserProps = processProfileFormData(_data);
      await saveUserProfile(formData);

      const newData: UserWithEmailProps = Object.assign({}, data, formData);
      setData(newData);

      notifySuccess('Profile successfully saved.');
    } catch (ex) {
      notifyError(getAxiosErrorMessage(ex as object));
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
  }, []);

  useEffect(() => {
    const _isEditing: boolean = searchParams.get('edit') === '1';
    _isEditing !== isEditing && setIsEditing(_isEditing);
  }, [isEditing, searchParams]);

  return (
    <ProfileContext.Provider value={{ data, isLoading, saveData, isEditing }}>
      {children}
    </ProfileContext.Provider>
  );
}
