'use client';

import React from 'react';
import styles from './button.module.css';
import Image from 'next/image';

export enum ButtonStyle {
  PrimaryFull = 'primary-full',
  Secondary = 'secondary',
  SecondaryFull = 'secondary-full',
  Tertiary = 'tertiary',
  TertiaryFull = 'tertiary-full',
}

interface ActionButtonProps {
  label: string;
  icon?: string;
  style?: ButtonStyle;
  disabled?: boolean;
  onClick?: () => void;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export default function ActionButton({
  label,
  icon,
  style,
  disabled,
  onClick,
  iconPosition = 'left',
  className,
}: ActionButtonProps) {
  let buttonStyles;

  switch (style) {
    case 'primary-full':
      buttonStyles = styles.btn1Full;
      break;
    case 'secondary':
      buttonStyles = styles.btn2;
      break;
    case 'secondary-full':
      buttonStyles = styles.btn2Full;
      break;
    case 'tertiary':
      buttonStyles = styles.btn3;
      break;
    case 'tertiary-full':
      buttonStyles = styles.btn3Full;
      break;
    default:
      buttonStyles = styles.btn1;
  }

  if (disabled) {
    buttonStyles = `${buttonStyles} ${styles.disabled}`;
  }
  if (className) {
    buttonStyles = `${buttonStyles} ${className}`;
  }

  return (
    <button className={buttonStyles} disabled={disabled} onClick={onClick}>
      {iconPosition === 'left' && icon && <Image src={icon} alt='icon' />}
      <span>{label}</span>
      {iconPosition === 'right' && icon && <Image src={icon} alt='icon' />}
    </button>
  );
}
