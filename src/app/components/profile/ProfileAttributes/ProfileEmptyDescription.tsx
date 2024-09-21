import { ReactNode } from 'react';
import styles from './profileAttribute.module.css';

export default function ProfileEmptyDescription(): ReactNode {
  return <span className={styles.emptyDesc}>N/A</span>;
}
