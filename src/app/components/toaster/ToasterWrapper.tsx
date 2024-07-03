import React from 'react';
import { Toaster } from 'react-hot-toast';
import styles from './toaster.module.css';
import classNames from 'classnames';

const ToasterWrapper: React.FC = () => {
  return (
    <Toaster
      containerClassName={styles.container}
      toastOptions={{
        className: classNames(styles.common, styles.default),
        success: {
          className: classNames(styles.common, styles.success),
          iconTheme: {
            primary: 'var(--skyBlue)',
            secondary: 'var(--navyBlue)',
          },
        },
        error: {
          className: classNames(styles.common, styles.error),
        },
      }}
    />
  );
};

export default ToasterWrapper;
