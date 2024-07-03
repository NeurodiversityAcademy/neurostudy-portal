'use client';
import React from 'react';
import styles from './button.module.css';
import Image from 'next/image';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import classNames from 'classnames';
import Link from 'next/link';

interface ActionButtonProps {
  label: string;
  icon?: string;
  style?: BUTTON_STYLE;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | undefined;
  iconPosition?: 'left' | 'right';
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  to?: string;
  fullWidth?: boolean;
}

export default function ActionButton({
  label,
  icon,
  style,
  disabled,
  onClick,
  iconPosition = 'left',
  className,
  type,
  to,
  fullWidth,
}: ActionButtonProps) {
  const buttonStyles = classNames(styles.common, className, {
    [styles.primary]: style === BUTTON_STYLE.Primary,
    [styles.secondary]: style === BUTTON_STYLE.Secondary,
    [styles.tertiary]: style === BUTTON_STYLE.Tertiary,
    [styles.disabled]: disabled,
    [styles.fullWidth]: fullWidth,
  });

  return (
    <button
      className={buttonStyles}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {iconPosition === 'left' && icon && <Image src={icon} alt='icon' />}
      {to ? <Link href={to}>{label}</Link> : <span>{label}</span>}
      {iconPosition === 'right' && icon && <Image src={icon} alt='icon' />}
    </button>
  );
}
