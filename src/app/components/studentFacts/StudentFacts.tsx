/* eslint-disable no-irregular-whitespace */
import React from 'react';
import styles from './studentFacts.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';

export default function Fact() {
  return (
    <div className={styles.factContainer}>
      <div className={styles.factTitle}>
        <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
          Neurodiversity in Adult Education
        </Typography>
      </div>
      <div className={styles.factGrid}>
        <div className={styles.gridItem}>
          <Typography variant={TypographyVariant.H1} color='var(--BondBlack)'>
            163%
          </Typography>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlackVariant)'
          >
            Increase in students starting university with a neurological
            condition — rising from 4,054 in 2021 to 10,665 in 2024.
          </Typography>
        </div>
        <div className={styles.gridItem}>
          <Typography variant={TypographyVariant.H1} color='var(--BondBlack)'>
            15–25%
          </Typography>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlackVariant)'
          >
            Improvement in retention is linked to access to adjustments such as
            extra time, flexible deadlines, coaching, and assistive technology.
          </Typography>
        </div>
        <div className={styles.gridItem}>
          <Typography variant={TypographyVariant.H1} color='var(--BondBlack)'>
            30–50%
          </Typography>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlackVariant)'
          >
            Neurodivergent students do not formally disclose at enrolment, often
            due to stigma or lack of diagnosis.
          </Typography>
        </div>
      </div>
      <div className={styles.factReference}>
        <Typography
          variant={TypographyVariant.Body3}
          color='var(--BondBlackVariant)'
        >
          *People with Disability in Australia 2022
        </Typography>
      </div>
    </div>
  );
}
