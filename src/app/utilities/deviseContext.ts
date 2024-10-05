'use client';

import { Context, createContext, useContext } from 'react';

export const deviseContext = <T>(
  defaultValue?: T
): [Context<T | undefined>, () => T] => {
  const CustomContext = createContext<T | undefined>(defaultValue);

  const useCustomContext = () => {
    const context = useContext(CustomContext);
    if (!context) {
      throw new Error(
        'deviseContext()[1](derivative of `useContext`) does not have proper context.'
      );
    }
    return context;
  };

  return [CustomContext, useCustomContext];
};
