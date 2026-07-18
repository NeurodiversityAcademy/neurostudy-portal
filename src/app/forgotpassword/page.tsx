import ForgotPassword from '../components/auth/ForgotPassword';
import { Metadata } from 'next';

import { META_KEY } from '@/app/utilities/constants';
import { createMetadata } from '@/app/utilities/common';

export const metadata: Metadata = createMetadata(META_KEY.FORGOT_PASSWORD, {
  robots: { index: false, follow: false },
});

const Page = () => {
  return <ForgotPassword />;
};

export default Page;
