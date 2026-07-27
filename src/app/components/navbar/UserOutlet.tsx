'use client';

import { BUTTON_STYLE } from '@/app/utilities/constants';
import ActionButton from '../buttons/ActionButton';
import styles from './navbar.module.css';
import { notifyError, notifySuccess } from '@/app/utilities/common';
import LoaderWrapper from '../loader/LoaderWrapper';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import classNames from 'classnames';

const UserOutlet: React.FC = () => {
  const { data: session } = useSession();
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

  if (!session) {
    return null;
  }

  return (
    <li className={classNames(styles.userOutletWrapper)}>
      <LoaderWrapper isLoading={isSigningOut}>
        <ActionButton
          label='Sign Out'
          style={BUTTON_STYLE.Primary}
          className={styles.userOutlet}
          onClick={onSignOut}
        />
      </LoaderWrapper>
    </li>
  );
};

export default UserOutlet;
