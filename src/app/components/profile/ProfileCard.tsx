'use client';

import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './profileCard.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import ArrowDown from '@/app/components/images/ArrowDown';
import classNames from 'classnames';

interface IconStrProps {
  leftIconSrc: string;
  leftIconAlt: string;
}

interface WithoutIconProps {
  leftIconSrc?: null;
  leftIconAlt?: null;
}

type IconProps = IconStrProps | WithoutIconProps;

type Props = {
  children?: ReactNode;
  title: string;
  collapsible?: boolean;
} & IconProps;

const ProfileCard: React.FC<Props> = ({
  title,
  leftIconSrc,
  leftIconAlt,
  children,
  collapsible = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleContent = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    !collapsible && setIsCollapsed(false);
  }, [collapsible]);

  return (
    <div
      className={classNames(styles.container, isCollapsed && styles.collapsed)}
    >
      <div className={styles.header}>
        {leftIconSrc && <Image src={leftIconSrc} alt={leftIconAlt} />}
        <Typography
          variant={TypographyVariant.Body2Strong}
          className={styles.title}
        >
          {title}
        </Typography>
        {collapsible && (
          <ArrowDown
            className={styles.collapsibleIcon}
            onClick={toggleContent}
          />
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default ProfileCard;
