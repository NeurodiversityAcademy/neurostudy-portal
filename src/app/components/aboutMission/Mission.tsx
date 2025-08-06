import React from 'react';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './mission.module.css';

export default function Mission() {
  return (
    <div className={styles.container}>
      <div className={styles.textBox}>
        {' '}
        <div className={styles.header}>
          <Typography variant={TypographyVariant.H2} color='var( --GhostWhite)'>
            Our Mission
          </Typography>
        </div>
        <div>
          <Typography
            variant={TypographyVariant.Body1}
            color='var( --GhostWhiteVariant)'
          >
            To connect Neurodivergent people with the right education and jobs,
            where they know they will be supported, understood and given the
            opportunity to progress in their careers.
          </Typography>
        </div>
      </div>
    </div>
  );
}
