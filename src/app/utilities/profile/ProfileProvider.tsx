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

interface PropType {
  children: ReactNode;
}

export interface ProfileContent {
  data: UserWithEmailProps | undefined;
  isLoading: boolean;
  saveData: (_data: Record<string, unknown>) => void;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<UserWithEmailProps>();

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

  return (
    <ProfileContext.Provider value={{ data, isLoading, saveData }}>
      {children}
    </ProfileContext.Provider>
  );
}
