'use client';

import styles from './auth.module.css';
import AuthLeftBanner from './AuthLeftBanner';
import classNames from 'classnames';
import AuthInitSignUp from './AuthInitSignUp';
import AuthFinishSignUp from './AuthFinishSignUp';
import { useAppSelector } from '@/app/redux/store';

const SignUp = () => {
  const user = useAppSelector((state) => state.authReducer.user);

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
