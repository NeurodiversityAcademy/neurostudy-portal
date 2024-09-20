'use client';

import {
  MouseEventHandler,
  ReactNode,
  useEffect,
  useId,
  useState,
} from 'react';
import Image from 'next/image';
import styles from './profileCard.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import ArrowDownIcon from '@/app/components/images/ArrowDown';
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
  const contentId = useId() + '-card-content';
  const [expanded, setExpanded] = useState(true);

  const toggleContent: MouseEventHandler = ({ currentTarget, target }) => {
    if (!collapsible) {
      return;
    }

    const selection = window.getSelection();

    if (
      currentTarget.querySelector('button')?.contains(target as Node) ||
      !selection ||
      !selection.toString() ||
      !currentTarget.contains(selection.focusNode)
    ) {
      setExpanded(!expanded);
    }
  };

  useEffect(() => {
    !collapsible && setExpanded(true);
  }, [collapsible]);

  return (
    <div
      className={classNames(
        styles.container,
        !expanded && styles.collapsed,
        popup && styles.popup
      )}
    >
      {header !== null &&
        (header === undefined ? (
          <div
            className={styles.header}
            {...(collapsible && {
              'aria-expanded': expanded,
              'aria-controls': contentId,
              role: 'button',
              onClick: toggleContent,
            })}
          >
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
              <button
                aria-expanded={expanded}
                aria-controls={contentId}
                className={styles.collapsibleIcon}
              >
                <ArrowDownIcon />
              </button>
            )}
          </div>
        ) : null)}
      <div className={styles.content} id={contentId} aria-hidden={!expanded}>
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
