import React, { ReactNode } from 'react';
import styles from './helperText.module.css';

interface PropType {
  children: ReactNode;
}

const HelperText: React.FC<PropType> = ({ children }) => {
  return children && <div className={styles.helper}>{children}</div>;
};

export default HelperText;
