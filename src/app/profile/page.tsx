import { Metadata } from 'next';

import { META_KEY } from '@/app/utilities/constants';
import { createMetadata } from '@/app/utilities/common';
import ProfileContainer from '../components/profile/ProfileContainer';

export const metadata: Metadata = createMetadata(META_KEY.PROFILE);

const Page = () => {
  return <ProfileContainer />;
};

export default Page;
