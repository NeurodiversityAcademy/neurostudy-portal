'use client';

import { BUTTON_STYLE } from '@/app/utilities/constants';
import ActionButton from '../buttons/ActionButton';
import styles from './navbar.module.css';
import { notifyError, notifySuccess } from '@/app/utilities/common';
import LoaderWrapper from '../loader/LoaderWrapper';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

const UserOutlet: React.FC = () => {
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  const onSignOut = () => {
    (async () => {
      setIsSigningOut(true);
      try {
        await signOut({ callbackUrl: '/' });
        notifySuccess('Successfully logged out.');
      } catch (ex) {
        notifyError(ex as object);
      } finally {
        setIsSigningOut(false);
      }
    })();
  };

  const isSessionLoading = status === 'loading';

  return (
    <li className={styles.li}>
      <LoaderWrapper isLoading={isSigningOut || isSessionLoading}>
        {session ? (
          <ActionButton
            label='Sign Out'
            style={BUTTON_STYLE.Primary}
            className={styles.userOutlet}
            onClick={onSignOut}
          />
        ) : (
          <ActionButton
            label='Login'
            style={BUTTON_STYLE.Primary}
            className={styles.userOutlet}
            // TODO
            // https://trello.com/c/suoF46yg/131-infrastructure-key-constant-based-url-setup
            to='/login'
          />
        )}
      </LoaderWrapper>
    </li>
  );
};

export default UserOutlet;
