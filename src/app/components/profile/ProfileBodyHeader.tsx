'use client';

import Image from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './profileBodyHeader.module.css';
import editImageIconSrc from '@/app/images/editImageIcon.svg';
import { notifyInProgress } from '@/app/utilities/common';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import { UserWithEmailProps } from '@/app/interfaces/User';
import ProfileCard from './ProfileCard';

const ProfileBodyHeader: React.FC = () => {
  const { data: _data, isLoading } = useProfileContext();

  const data: UserWithEmailProps = _data || {
    FirstName: '',
    LastName: '',
    Email: '',
  };

  // TODO
  // Fetch `Age`/`DOB`
  const Age = isLoading ? '' : 24;

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
          <Typography variant={TypographyVariant.H3} className='mb-0'>
            {data.FirstName + ' ' + data.LastName}
          </Typography>
          <Typography variant={TypographyVariant.Body3} color='var(--grey-300)'>
            {[data.Email, Age ? Age + ' Years' : '']
              .filter((v) => v)
              .join(' | ')}
          </Typography>
        </div>
      </div>
    </ProfileCard>
  );
};

export default ProfileBodyHeader;
