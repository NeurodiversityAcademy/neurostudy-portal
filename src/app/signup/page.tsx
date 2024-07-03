import SignUp from '@/app/components/auth/Signup';
import { Metadata } from 'next';

import { META_KEY } from '@/app/utilities/constants';
import { createMetadata } from '@/app/utilities/common';

export const metadata: Metadata = createMetadata(META_KEY.SIGNUP);

const Page = () => {
  return <SignUp />;
};

export default Page;
