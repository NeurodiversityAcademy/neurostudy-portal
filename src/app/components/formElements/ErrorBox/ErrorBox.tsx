import React, { ReactNode } from 'react';
import styles from './errorbox.module.css';

interface ErrorBoxProps {
  message: string | undefined;
  label: string;
}

const ErrorBox = ({ message, label }: Partial<ErrorBoxProps>) => {
  return (
    <small className={styles.errorMessage}>
      {(message || `${label} is invalid.`) as ReactNode}
    </small>
  );
};

export default ErrorBox;
