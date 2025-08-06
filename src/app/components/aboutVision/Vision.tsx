import React from 'react';

import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './vision.module.css';

export default function Vision() {
  return (
    <div className={styles.container}>
      <div className={styles.textBox}>
        <div className={styles.header}>
          <Typography variant={TypographyVariant.H2}>Our Vision</Typography>
        </div>
        <div>
          <Typography variant={TypographyVariant.Body1}>
            To set the standard around Neurodiversity in higher education and
            the working environment and to allow Neurodivergent people to feel
            safe and supported while developing in their careers.
          </Typography>
        </div>
      </div>
    </div>
  );
}
