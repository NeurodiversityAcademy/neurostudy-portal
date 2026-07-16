import { Suspense } from 'react';
import { Metadata } from 'next';

import { META_KEY } from '@/app/utilities/constants';
import { createMetadata } from '@/app/utilities/common';
import ProfileContainer from '../components/profile/ProfileContainer';
import ProfileProvider from '../utilities/profile/ProfileProvider';

export const metadata: Metadata = createMetadata(META_KEY.PROFILE);

const Page = async () => {
  return (
    <Suspense fallback={null}>
      <ProfileProvider>
        <ProfileContainer />
      </ProfileProvider>
    </Suspense>
  );
};

export default Page;
