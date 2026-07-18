'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface PropType {
  children: ReactNode;
}

const NextAuthProvider: React.FC<PropType> = ({ children }: PropType) => {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      {children}
    </SessionProvider>
  );
};

export default NextAuthProvider;
