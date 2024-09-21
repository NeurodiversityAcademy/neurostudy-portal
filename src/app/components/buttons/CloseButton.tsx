'use client';

import Image from 'next/image';
import Close from '../../../app/images/close.svg';
import { CSSProperties, HTMLAttributes, ReactEventHandler } from 'react';
import classNames from 'classnames';
import styles from './closeButton.module.css';

interface CloseButtonProps extends HTMLAttributes<HTMLButtonElement> {
  onClick?: ReactEventHandler<HTMLButtonElement>;
  className?: string;
  translateX?: number;
  translateY?: number;
}

const CloseButton = ({
  onClick,
  className,
  translateX,
  translateY,
  ...rest
}: CloseButtonProps) => {
  const translateXY = [
    translateX && 'translateX(' + translateX + 'px)',
    translateY && 'translateY(' + translateY + 'px)',
  ].filter((value) => value);
  const style: CSSProperties | undefined = translateXY.length
    ? { transform: translateXY.join(',') }
    : undefined;

  return (
    <button
      onClick={onClick}
      style={style}
      className={classNames(styles.closeBtn, className)}
      aria-label='Close'
      {...rest}
    >
      <Image src={Close} alt='Close'></Image>
    </button>
  );
};

export default CloseButton;
