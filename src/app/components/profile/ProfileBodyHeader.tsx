'use client';

import Image from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './profileBodyHeader.module.css';
import editImageIconSrc from '@/app/images/editImageIcon.svg';
import { notifyInProgress } from '@/app/utilities/common';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import ProfileCard from './ProfileCard';
import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import { useRouter } from 'next/navigation';

type ProfileBodyHeaderPropType = {
  FirstName: string;
  LastName: string;
  Email: string;
  Age: number;
};

const ProfileBodyHeader: React.FC = () => {
  const { data, isLoading, isEditing } = useProfileContext();
  const router = useRouter();

  const {
    FirstName = '',
    LastName = '',
    Email = '',
    Age = 0,
  } = (data as ProfileBodyHeaderPropType) || {};

  return (
    <ProfileCard header={null} isLoading={isLoading}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <Image
            src={editImageIconSrc}
            alt='Edit Image'
            onClick={() => notifyInProgress()}
          />
        </div>
        <div className={styles.content}>
          <Typography variant={TypographyVariant.H3} className='m-0'>
            {FirstName + ' ' + LastName}
          </Typography>
          <Typography variant={TypographyVariant.Body3} color='var(--grey-300)'>
            {[Email, Age ? Age + ' Years' : ''].filter((v) => v).join(' | ')}
          </Typography>
        </div>
        {!isEditing && (
          <ActionButton
            label='Edit Profile'
            style={BUTTON_STYLE.Secondary}
            className={styles.editBtn}
            onClick={() => {
              router.push('?edit=1');
            }}
          />
        )}
      </div>
    </ProfileCard>
  );
};

export default ProfileBodyHeader;
