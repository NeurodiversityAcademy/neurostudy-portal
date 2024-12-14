'use client';

import styles from './auth.module.css';
import AuthLeftBanner from './AuthLeftBanner';
import classNames from 'classnames';
import AuthInitSignUp from './AuthInitSignUp';
import LoaderWrapper from '../loader/LoaderWrapper';
import { signOut, useSession } from 'next-auth/react';
import useAuthError from '@/app/hooks/useAuthError';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import queryString from '@/app/utilities/queryString';
import { getCallbackUrlOnSignIn } from '@/app/utilities/auth/helper';

const SignUp: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();
  const isLoading = status === 'loading';

  useEffect(() => {
    (async () => {
      if (queryString.parse()['checkout_status'] === 'success') {
        await signOut({ redirect: false });
        router.replace(
          `${queryString.stringify(
            { checkout_status: undefined },
            { useLocationSearch: true }
          )}${window.location.hash}`
        );
        return;
      }

      status === 'authenticated' && router.push(getCallbackUrlOnSignIn());
    })();
  }, [status, router]);

  useAuthError();

  return (
    <main className={styles.container}>
      <LoaderWrapper isLoading={isLoading} className='row'>
        <AuthLeftBanner />
        <div className={classNames(styles.formColumn, 'col-md-8')}>
          <AuthInitSignUp />
        </div>
      </LoaderWrapper>
    </main>
  );
};

export default SignUp;
