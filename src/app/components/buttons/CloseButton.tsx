import Image from 'next/image';
import Close from '../../../app/images/close.svg';
import { HTMLAttributes, ReactEventHandler } from 'react';
import classNames from 'classnames';
import styles from './closeButton.module.css';

interface CloseButtonProps extends HTMLAttributes<HTMLButtonElement> {
  onClick?: ReactEventHandler<HTMLButtonElement>;
  className?: string;
}

const CloseButton = ({ onClick, className, ...rest }: CloseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={classNames(styles.closeBtn, className)}
      aria-label='Close'
      {...rest}
    >
      <Image src={Close} alt='Close'></Image>
    </button>
  );
};

export default CloseButton;
