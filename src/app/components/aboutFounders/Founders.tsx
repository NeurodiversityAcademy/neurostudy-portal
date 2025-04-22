'use client';
import React from 'react';
import Image from 'next/image';
import Will from '../../images/Will.jpeg';
import Pratik from '../../images/Pratik.svg';
import linkedin from '../../images/linkedin.svg';

import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './founders.module.css';

export default function Founders() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant={TypographyVariant.H2} color='var(--GhostWhite)'>
          Meet Our Founders
        </Typography>
      </div>
      <div className={styles.grid}>
        <div className={styles.gridItem}>
          <div>
            <Image src={Will} alt={'Will photo'} className={styles.image}></Image>
          </div>
          <div className={styles.textBox}>
            {' '}
            <div>
              {' '}
              <Typography
                variant={TypographyVariant.Body1}
                color='var(--GhostWhite)'
              >
                Will Wheeler
              </Typography>
            </div>
            <div className={styles.role}>
              <Typography
                variant={TypographyVariant.Body2}
                color='var(--GhostWhite)'
              >
                Founder and Director
              </Typography>
            </div>
          </div>
          <div className={styles.icon}>
            <a
              href='https://www.linkedin.com/in/wheelerwill/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image src={linkedin} alt={'linkedin icon'} />
            </a>
          </div>
        </div>
        <div className={styles.gridItem}>
          <div>
            <Image src={Pratik} alt={'Pratik photo'} className={styles.image}></Image>
          </div>
          <div className={styles.textBox}>
            <div>
              <Typography
                variant={TypographyVariant.Body1}
                color='var(--GhostWhite)'
              >
                Pratik Bhumkar
              </Typography>
            </div>

            <div className={styles.role}>
              {' '}
              <Typography
                variant={TypographyVariant.Body2}
                color='var(--GhostWhite)'
              >
                Head of IT
              </Typography>
            </div>
          </div>
          <div className={styles.icon}>
            <a
              href='https://www.linkedin.com/in/pratik-bhumkar/'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image src={linkedin} alt={'linkedin icon'} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
