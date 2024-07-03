import React from 'react';
import styles from './button.module.css';
import MyPrimary from './MyPrimary';
import MySecondary from './MySecondary';
import MyTertiary from './MyTertiary';

export default function ButtonDisplay() {
  return (
    <div>
      <div className={styles.display}>
        <MyPrimary />
      </div>
      <div className={styles.display}>
        <MySecondary />
      </div>
      <div className={styles.display}>
        <MyTertiary />
      </div>
    </div>
  );
}
