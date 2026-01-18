import React from 'react';
import styles from './howItWorks.module.css';
import Image from 'next/image';
import explore from '../../images/stepsExplore.svg';
import enquire from '../../images/stepsEnquire.svg';
import profile from '../../images/stepsProfile.svg';
import quality from '../../images/stepsQuality.svg';
import guide from '../../images/stepsGuide.svg';
import lineDefault from '../../images/stepsLine4.svg';
// import lineMobile from '../../images/stepsline1Mobile.svg';
import Typography, { TypographyVariant } from '../typography/Typography';

export default function HowItWorksNew() {
  const steps = [
    {
      id: 'explore',
      img: explore,
      title: 'Explore',
      desc: 'You search for learning organisations',
    },
    {
      id: 'enquire',
      img: enquire,
      title: 'Enquire',
      desc: 'You send an inquiry, we promptly respond',
    },
    {
      id: 'profile',
      img: profile,
      title: 'Profile',
      desc: 'You fill out a profile for the learning provider',
    },
    {
      id: 'quality',
      img: quality,
      title: 'Quality',
      desc: 'We improve experience with great materials',
    },
    {
      id: 'guide',
      img: guide,
      title: 'Guide',
      desc: 'We regularly monitor & support learning',
    },
  ];

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
        {steps.map((step, idx) => (
          <div key={step.id} className={styles.stepWrapper}>
            <div className={styles.gridItem}>
              <Image src={step.img} alt={step.id} width={72} height={72} />
              <div className={styles.stepsText}>
                <Typography
                  variant={TypographyVariant.Body1}
                  color='var(--GhostWhite)'
                >
                  {step.title}
                </Typography>
                <Typography
                  variant={TypographyVariant.Body2}
                  color='var(--GhostWhite)'
                >
                  {step.desc}
                </Typography>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className={styles.connector} aria-hidden>
                <Image
                  src={lineDefault}
                  alt='connector'
                  width={34}
                  height={160}
                  className={styles.connectorImg}
                />
                {/* <Image
                  src={lineMobile}
                  alt='connector-mobile'
                  width={200}
                  height={18}
                  className={styles.connectorImgMobile}
                /> */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
