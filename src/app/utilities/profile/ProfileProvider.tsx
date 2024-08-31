'use client';

import { UserWithEmailProps } from '@/app/interfaces/User';
import getUserProfile from './getUser';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface PropType {
  children: ReactNode;
}

export interface ProfileContent {
  data: UserWithEmailProps | undefined;
  isLoading: boolean;
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

  useEffect(() => {
    const getData = async () => {
      setData(await getUserProfile());
      setIsLoading(false);
    };

    setIsLoading(true);

    getData();
  }, []);

  return (
    <ProfileContext.Provider value={{ data, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}
