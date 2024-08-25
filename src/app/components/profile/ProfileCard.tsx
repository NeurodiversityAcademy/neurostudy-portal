import { ReactNode } from 'react';
import Image from 'next/image';
import styles from './profileCard.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';

interface IconProps {
  leftIconSrc: string;
  leftIconAlt: string;
}

interface WithoutIconProps {
  leftIconSrc?: null;
  leftIconAlt?: null;
}

type FullIconProps = IconProps | WithoutIconProps;

type Props = {
  children?: ReactNode;
  title: string;
  collapsible?: boolean;
} & FullIconProps;

const ProfileCard: React.FC<Props> = ({
  title,
  leftIconSrc,
  leftIconAlt,
  children,
  collapsible = false,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {leftIconSrc && <Image src={leftIconSrc} alt={leftIconAlt} />}
        <Typography
          variant={TypographyVariant.Body2Strong}
          className={styles.title}
        >
          {title}
        </Typography>
        {collapsible && (
          <div className={styles.collapsibleIcon}>Collapsible Icon</div>
        )}
      </div>
      {children}
    </div>
  );
};

export default ProfileCard;
