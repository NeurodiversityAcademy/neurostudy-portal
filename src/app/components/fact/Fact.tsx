/* eslint-disable no-irregular-whitespace */
import React from 'react';
import styles from './fact.module.css';
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
            66%
          </Typography>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlackVariant)'
          >
            Of undergraduate courses were less likely than those without
            disability (69%) to give a positive rating to the quality of their
            entire educational experience.
          </Typography>
        </div>
        <div className={styles.gridItem}>
          <Typography variant={TypographyVariant.H1} color='var(--BondBlack)'>
            27%
          </Typography>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlackVariant)'
          >
            Of undergraduate courses were more likely than those without
            disability(19%)to consider early departure from their course.
          </Typography>
        </div>
        <div className={styles.gridItem}>
          <Typography variant={TypographyVariant.H1} color='var(--BondBlack)'>
            56%
          </Typography>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlackVariant)'
          >
            (56% or 96,400) are less likely to attend a private training
            provider than those without disability (73% or 2.4 million)
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
