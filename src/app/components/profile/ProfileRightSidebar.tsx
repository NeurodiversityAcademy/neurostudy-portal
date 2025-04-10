import styles from './profileRightSidebar.module.css';
import Image from 'next/image';
import level1ImgSrc from '@/app/images/level1.png';
import starImgSrc from '@/app/images/star.svg';
import Typography, { TypographyVariant } from '../typography/Typography';

const ProfileRightSidebar: React.FC = () => {
  return (
    <div className={styles.container}>
      <Image src={level1ImgSrc} alt='Level 1' />
      <div className={styles.level}>
        <Image src={starImgSrc} alt='Star' />
        <Typography
          variant={TypographyVariant.Body2Strong}
          color='var(--cherryPieVariant)'
        >
          Level 1
        </Typography>
      </div>
      <div className={styles.slider}>
        <div />
      </div>
      <Typography variant={TypographyVariant.Body2}>
        Complete 1 Step to reach Level 2
      </Typography>
    </div>
  );
};

export default ProfileRightSidebar;
