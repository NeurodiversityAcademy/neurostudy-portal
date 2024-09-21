'use client';

import styles from './auth.module.css';
import AuthLeftBanner from './AuthLeftBanner';
import classNames from 'classnames';
import AuthInitSignUp from './AuthInitSignUp';
import LoaderWrapper from '../loader/LoaderWrapper';
import { useSession } from 'next-auth/react';
import useAuthError from '@/app/hooks/useAuthError';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SignUp: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  useEffect(() => {
    session && router.push('/profile');
  }, [session, router]);

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
