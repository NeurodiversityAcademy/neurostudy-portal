'use client';

import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './profileCard.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import ArrowDown from '@/app/components/images/ArrowDown';
import classNames from 'classnames';
import LoaderWrapper from '../loader/LoaderWrapper';

interface WithHeaderProps {
  header: ReactNode | null;
  title?: undefined;
}

interface WithoutHeaderProps {
  header?: undefined;
  title: string;
}

type HeaderProps = WithHeaderProps | WithoutHeaderProps;

interface WithIconProps {
  leftIconSrc: string;
  leftIconAlt: string;
}

interface WithoutIconProps {
  leftIconSrc?: null;
  leftIconAlt?: null;
}

type IconProps = WithIconProps | WithoutIconProps;

type Props = {
  isLoading?: boolean;
  children?: ReactNode;
  collapsible?: boolean;
  popup?: boolean;
} & IconProps &
  HeaderProps;

const ProfileCard: React.FC<Props> = ({
  isLoading = false,
  title,
  leftIconSrc,
  leftIconAlt,
  children,
  collapsible = false,
  header,
  popup = false,
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
      className={classNames(
        styles.container,
        isCollapsed && styles.collapsed,
        popup && styles.popup
      )}
    >
      {header !== null &&
        (header === undefined ? (
          <div className={styles.header}>
            {!popup && leftIconSrc && (
              <Image src={leftIconSrc} alt={leftIconAlt} />
            )}
            <Typography
              variant={TypographyVariant.Body2Strong}
              className={styles.title}
            >
              {title}
            </Typography>
            {!popup && collapsible && (
              <ArrowDown
                className={styles.collapsibleIcon}
                onClick={toggleContent}
              />
            )}
          </div>
        ) : null)}
      <div className={styles.content}>
        <LoaderWrapper
          isLoading={isLoading}
          loaderAlignTop
          className={styles.formWrapper}
        >
          {children}
        </LoaderWrapper>
      </div>
    </div>
  );
};

export default ProfileCard;
