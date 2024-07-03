'use client';

import { BUTTON_STYLE } from '@/app/utilities/constants';
import ActionButton from '../buttons/ActionButton';
import styles from './navbar.module.css';
import { useRootContext } from '@/app/root-provider';
import { signOut } from 'aws-amplify/auth';
import toast from 'react-hot-toast';
import { notifyError } from '@/app/utilities/common';
import LoaderWrapper from '../loader/LoaderWrapper';
import { useState } from 'react';

const UserOutlet: React.FC = () => {
  const { user } = useRootContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSignOut = () => {
    (async () => {
      setIsLoading(true);
      try {
        await signOut();
        toast.success('Successfully logged out.');
      } catch (ex) {
        notifyError(ex as object);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <li className={styles.li}>
      {user ? (
        <LoaderWrapper isLoading={isLoading}>
          <ActionButton
            label='Sign Out'
            style={BUTTON_STYLE.Primary}
            className={styles.userOutlet}
            onClick={onSignOut}
          />
        </LoaderWrapper>
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
    </li>
  );
};

export default UserOutlet;
