import { Suspense } from 'react';
import Login from '@/app/components/auth/Login';
import { Metadata } from 'next';

import { META_KEY } from '@/app/utilities/constants';
import { createMetadata } from '@/app/utilities/common';

export const metadata: Metadata = createMetadata(META_KEY.LOGIN, {
  robots: { index: false, follow: false },
});

const Page = () => {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  );
};

export default Page;
