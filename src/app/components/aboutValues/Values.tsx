import React from 'react';
import Image from 'next/image';

import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './values.module.css';
import support from '../../images/valuesSupport.svg';
import respect from '../../images/valuesRespect.svg';
import safety from '../../images/valuesSafety.svg';
import innovation from '../../images/valueInnovation.svg';
import fun from '../../images/valueFun.svg';
import leadership from '../../images/valueLeadership.svg';

export default function Values() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant={TypographyVariant.H2}>Core Values</Typography>
      </div>
      <div className={styles.grid}>
        <div className={styles.gridItem}>
          <div>
            <Image src={support} alt={'support'}></Image>
          </div>
          <div className={styles.gridTextBox}>
            <div>
              <Typography
                variant={TypographyVariant.Body1}
                color='var( --GhostWhiteVariant)'
              >
                Support
              </Typography>
            </div>
            <div className={styles.gridText}>
              <Typography
                variant={TypographyVariant.Body2}
                color='var( --GhostWhiteVariant)'
              >
                Supporting individuals to feel comfortable and confident in
                their identity
              </Typography>
            </div>
          </div>
        </div>
        <div className={styles.gridItem}>
          <div>
            <Image src={respect} alt={'respect'}></Image>
          </div>
          <div className={styles.gridTextBox}>
            <div>
              <Typography
                variant={TypographyVariant.Body1}
                color='var( --GhostWhiteVariant)'
              >
                Respect
              </Typography>
            </div>
            <div className={styles.gridText}>
              <Typography
                variant={TypographyVariant.Body2}
                color='var( --GhostWhiteVariant)'
              >
                Encouraging respect for everyone and the diverse ideas they wish
                to share
              </Typography>
            </div>
          </div>
        </div>
        <div className={styles.gridItem}>
          {' '}
          <div>
            <Image src={safety} alt={'safety'}></Image>
          </div>
          <div className={styles.gridTextBox}>
            <div>
              <Typography
                variant={TypographyVariant.Body1}
                color='var( --GhostWhiteVariant)'
              >
                Safety
              </Typography>
            </div>
            <div className={styles.gridText}>
              <Typography
                variant={TypographyVariant.Body2}
                color='var( --GhostWhiteVariant)'
              >
                Everyone should feel safe in the environment they are in and the
                people they interact with.
              </Typography>
            </div>
          </div>
        </div>
        <div className={styles.gridItem}>
          <div>
            <Image src={innovation} alt={'innovation'}></Image>
          </div>
          <div className={styles.gridTextBox}>
            <div>
              <Typography
                variant={TypographyVariant.Body1}
                color='var( --GhostWhiteVariant)'
              >
                Innovation
              </Typography>
            </div>
            <div className={styles.gridText}>
              <Typography
                variant={TypographyVariant.Body2}
                color='var( --GhostWhiteVariant)'
              >
                {' '}
                Innovation and standing out while supporting the Neurodiversity
                community
              </Typography>
            </div>
          </div>
        </div>
        <div className={styles.gridItem}>
          <div>
            <Image src={fun} alt={'fun'}></Image>
          </div>
          <div className={styles.gridTextBox}>
            <div>
              <Typography
                variant={TypographyVariant.Body1}
                color='var( --GhostWhiteVariant)'
              >
                Fun
              </Typography>
            </div>
            <div className={styles.gridText}>
              <Typography
                variant={TypographyVariant.Body2}
                color='var( --GhostWhiteVariant)'
              >
                Everything we do should be all about having fun and working
                together as a team.
              </Typography>
            </div>
          </div>
        </div>
        <div className={styles.gridItem}>
          <div>
            <Image src={leadership} alt={'leadership'}></Image>
          </div>
          <div className={styles.gridTextBox}>
            <div>
              <Typography
                variant={TypographyVariant.Body1}
                color='var( --GhostWhiteVariant)'
              >
                Leadership
              </Typography>
            </div>
            <div className={styles.gridText}>
              <Typography
                variant={TypographyVariant.Body2}
                color='var( --GhostWhiteVariant)'
              >
                We embody leadership in all we do, while actively fostering
                tomorrow&apos;s leaders
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
