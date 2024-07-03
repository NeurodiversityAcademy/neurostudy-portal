import Login from '@/app/components/auth/Login';
import { Metadata } from 'next';

import { META_KEY } from '@/app/utilities/constants';
import { createMetadata } from '@/app/utilities/common';

export const metadata: Metadata = createMetadata(META_KEY.LOGIN);

const Page = () => {
  return <Login />;
};

export default Page;
