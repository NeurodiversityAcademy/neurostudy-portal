'use client';

import React from 'react';
import ArrowDownCircle from '../../images/arrowDownCircle.jpg';
import ActionButton from './ActionButton';
import styles from './button.module.css';

interface MyLoginProps {
  className?: string;
}
export default function myLogin({ className }: MyLoginProps) {
  return (
    <ActionButton
      label='Login'
      icon={ArrowDownCircle}
      disabled={false}
      iconPosition='right'
      onClick={() => console.log('clicked login button')}
      className={`${styles.login} ${className}`}
    />
  );
}
