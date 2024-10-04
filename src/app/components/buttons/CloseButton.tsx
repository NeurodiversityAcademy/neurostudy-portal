import Image from 'next/image';
import Close from '../../../app/images/close.svg';
import { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react';
import classNames from 'classnames';
import styles from './closeButton.module.css';

interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const CloseButton = (
  { className, ...rest }: CloseButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) => {
  return (
    <button
      ref={ref}
      type='button'
      className={classNames(styles.closeBtn, className)}
      aria-label='Close'
      {...rest}
    >
      <Image src={Close} alt='Close'></Image>
    </button>
  );
};

export default forwardRef(CloseButton);
