'use client';

import Image from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './profileBodyHeader.module.css';
import editImageIconSrc from '@/app/images/editImageIcon.svg';
import { notifyInProgress } from '@/app/utilities/common';

interface Props {
  user: Record<string, string | number>;
}

const ProfileBodyHeader: React.FC<Props> = ({ user }) => {
  const { username, email, age } = user;

  return (
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
          {username}
        </Typography>
        <Typography variant={TypographyVariant.Body3} color='var(--grey-300)'>
          {[email, age ? age + ' Years' : ''].filter((v) => v).join(' | ')}
        </Typography>
      </div>
    </div>
  );
};

export default ProfileBodyHeader;
