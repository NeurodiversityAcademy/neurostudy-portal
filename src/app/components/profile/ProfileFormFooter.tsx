'use client';

import { BUTTON_STYLE } from '@/app/utilities/constants';
import ActionButton from '../buttons/ActionButton';
import styles from './profileFormFooter.module.css';
import { MouseEventHandler } from 'react';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import classNames from 'classnames';

interface Props {
  className?: string;
  onSubmit?: MouseEventHandler<HTMLButtonElement>;
  onCancel?: MouseEventHandler<HTMLButtonElement>;
}

const ProfileFormFooter: React.FC<Props> = ({
  className,
  onCancel,
  onSubmit,
}) => {
  const { isLoading } = useProfileContext();

  return (
    <div className={classNames(styles.container, className)}>
      <ActionButton
        type='button'
        label='Cancel'
        style={BUTTON_STYLE.Secondary}
        className={styles.cancelBtn}
        onClick={onCancel}
      />
      <ActionButton
        type={onSubmit ? 'button' : 'submit'}
        label='Save'
        style={BUTTON_STYLE.Primary}
        className={styles.saveBtn}
        onClick={onSubmit}
        disabled={isLoading}
      />
    </div>
  );
};

export default ProfileFormFooter;
