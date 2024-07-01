import React from 'react';
import styles from './howItWorks.module.css';
import Image from 'next/image';
import explore from '../../images/stepsExplore.jpg';
import enquire from '../../images/stepsEnquire.jpg';
import profile from '../../images/stepsProfile.jpg';
import quality from '../../images/stepsQuality.jpg';
import guide from '../../images/stepsGuide.jpg';
import Typography, { TypographyVariant } from '../typography/Typography';

export default function HowItWorks() {
  return (
    <div className={styles.stepsContainer}>
      <div className={styles.stepsTitle}>
        <Typography variant={TypographyVariant.H2} color='var(--GhostWhite)'>
          How it works?
        </Typography>
        <Typography variant={TypographyVariant.Body1} color='var(--GhostWhite)'>
          Neurodiversity Academy understands the challenges neurodivergent
          students face and provides support at every stage of the study
          journey.
        </Typography>
      </div>

      <div className={styles.stepsGrid}>
        <div className={styles.gridItem1}>
          <Image src={explore} alt='explore'></Image>

          <div className={styles.stepsText}>
            <Typography
              variant={TypographyVariant.Body1}
              color='var(--GhostWhite)'
            >
              Explore
            </Typography>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--GhostWhite)'
            >
              You search for learning organisations
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
          <Image src={profile} alt='profile'></Image>
          <div className={styles.stepsText}>
            {' '}
            <Typography
              variant={TypographyVariant.Body1}
              color='var(--GhostWhite)'
            >
              Profile
            </Typography>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--GhostWhite)'
            >
              You fill out a profile for the learning provider
            </Typography>
          </div>
        </div>

        <div className={styles.gridItem}>
          <Image src={quality} alt='quality'></Image>
          <div className={styles.stepsText}>
            <Typography
              variant={TypographyVariant.Body1}
              color='var(--GhostWhite)'
            >
              Quality
            </Typography>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--GhostWhite)'
            >
              We improve experience with great materials
            </Typography>
          </div>
        </div>

        <div className={styles.gridItem5}>
          <Image src={guide} alt='guide'></Image>
          <div className={styles.stepsText}>
            <Typography
              variant={TypographyVariant.Body1}
              color='var(--GhostWhite)'
            >
              Guide
            </Typography>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--GhostWhite)'
            >
              We regularly monitor & support learning
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
