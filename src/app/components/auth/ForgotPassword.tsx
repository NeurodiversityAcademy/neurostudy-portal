'use client';

import styles from './auth.module.css';
import AuthLeftBanner from './AuthLeftBanner';
import classNames from 'classnames';
import { useState } from 'react';
import { FORM_STATE } from '@/app/utilities/auth/constants';
import AuthInitForgotPassword from './AuthInitForgotPassword';
import AuthFinishForgotPassword from './AuthFinishForgotPassword';
import { useRouter } from 'next/navigation';

const ForgotPassword = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [formState, setFormState] = useState<FORM_STATE>(FORM_STATE.INITIALIZED);
  const isConfirming = formState === FORM_STATE.CONFIRM_RESET_PASSWORD_WITH_CODE;

  const handleVerificationCode = (username: string) => {
    setUsername(username);
    setFormState(FORM_STATE.CONFIRM_RESET_PASSWORD_WITH_CODE);
  };

  const handleResetDone = () => {
    router.push('/login');
  };

  return (
    <main className={styles.container}>
      <div className='row'>
        <AuthLeftBanner />
        <div className={classNames(styles.formColumn, 'col-md-8')}>
          {!isConfirming ? (
            <AuthInitForgotPassword {...{ handleVerificationCode }} />
          ) : (
            <AuthFinishForgotPassword {...{ username, handleResetDone }} />
          )}
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
