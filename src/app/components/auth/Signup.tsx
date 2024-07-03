'use client';

import styles from './auth.module.css';
import AuthLeftBanner from './AuthLeftBanner';
import classNames from 'classnames';
import AuthInitSignUp from './AuthInitSignUp';
import AuthFinishSignUp from './AuthFinishSignUp';
import { useRootContext } from '@/app/root-provider';

const SignUp = () => {
  const { user } = useRootContext();

  return (
    <main className={styles.container}>
      <div className='row'>
        <AuthLeftBanner />
        <div className={classNames(styles.formColumn, 'col-md-8')}>
          {user ? <AuthFinishSignUp /> : <AuthInitSignUp />}
        </div>
      </div>
    </main>
  );
};

export default SignUp;
