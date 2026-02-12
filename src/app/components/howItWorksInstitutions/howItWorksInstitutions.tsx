import React from 'react';
import styles from './howItWorksInstitutions.module.css';
import Image from 'next/image';
import enquire from '../../images/stepsEnquire.svg';
import stepEndorsement from '../../images/stepEndorsement.png';
// import profile from '../../images/stepsProfile.svg';
import quality from '../../images/stepsQuality.svg';
import guide from '../../images/stepsGuide.svg';
import Typography, { TypographyVariant } from '../typography/Typography';

export default function HowItWorksInstitutions() {
  return (
    <div className={styles.stepsContainer}>
      <div className={styles.stepsTitle}>
        <Typography variant={TypographyVariant.H2} color='var(--GhostWhite)'>
          How it works?
        </Typography>
        <Typography variant={TypographyVariant.Body1} color='var(--GhostWhite)'>
          Supporting institutions to deliver inclusive education that works in
          practice.
        </Typography>
      </div>

      <div className={styles.stepsGrid}>
        <div className={styles.gridItem1}>
          <Image src={enquire} alt='enquire'></Image>
          <div className={styles.stepsText}>
            <Typography
              variant={TypographyVariant.Body1}
              color='var(--GhostWhite)'
            >
              Enquire
            </Typography>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--GhostWhite)'
            >
              You send an inquiry, we promptly respond
            </Typography>
          </div>
        </div>
        <div className={styles.gridItem}>
          <Image src={enquire} alt='enquire'></Image>
          <div className={styles.stepsText}>
            {' '}
            <Typography
              variant={TypographyVariant.Body1}
              color='var(--GhostWhite)'
            >
              Form
            </Typography>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--GhostWhite)'
            >
              You fill out a form describing the support provided.
            </Typography>
          </div>
        </div>

        <div className={styles.gridItem}>
          <Image src={guide} alt='guide'></Image>
          <div className={styles.stepsText}>
            {' '}
            <Typography
              variant={TypographyVariant.Body1}
              color='var(--GhostWhite)'
            >
              Evaulation
            </Typography>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--GhostWhite)'
            >
              We evaluate the responses and get back to you with feedback
            </Typography>
          </div>
        </div>

        <div className={styles.gridItem}>
          <Image
            src={stepEndorsement}
            width={110}
            height={110}
            alt='endorsement'
          ></Image>

          <div className={styles.stepsText}>
            <Typography
              variant={TypographyVariant.Body1}
              color='var(--GhostWhite)'
            >
              Endorse
            </Typography>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--GhostWhite)'
            >
              We endorse you as a neurodiversity friendly institution
            </Typography>
          </div>
        </div>

        <div className={styles.gridItem5}>
          <Image src={quality} alt='quality'></Image>
          <div className={styles.stepsText}>
            <Typography
              variant={TypographyVariant.Body1}
              color='var(--GhostWhite)'
            >
              Promote
            </Typography>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--GhostWhite)'
            >
              We promote your institution on our platform.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
