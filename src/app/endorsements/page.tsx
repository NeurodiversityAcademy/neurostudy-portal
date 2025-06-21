'use client';
import React from 'react';
// import { Metadata } from 'next';
// import { BUTTON_STYLE, META_KEY } from '../utilities/constants';
// import { createMetadata } from '../utilities/common';
import styles from './endorsements.module.css';
import HomeBanner from '../components/banner/HomeBanner';
import Typography, {
  TypographyVariant,
} from '../components/typography/Typography';
import Image from 'next/image';
import bronzeBadge from '../images/bronzeBadge.svg';
import Unify360 from '../images/logo_unify360.svg';

// export const metadata: Metadata = createMetadata(META_KEY.ENDORSEMENTS);

export default function Page() {
  return (
    <div className={styles.container}>
      <HomeBanner displayBadges={false} />
      <div className={styles.teacherContainer}>
        <div>
          <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
            Our endorsed insitutes
          </Typography>
        </div>
        <div className={styles.teacherBodyText}>
          <div className={styles.level}>
            <Image
              src={bronzeBadge}
              alt='Bronze Badge'
              className={styles.badge}
            />
          </div>
          <div>
            <Typography
              variant={TypographyVariant.Body1}
              color='var(--BondBlack)'
            >
              Description of the bronze level endorsement goes here. This is
              where you can explain what it means to be at this level and what
              the institute can provide as support.
            </Typography>
            <div>
              <a href='https://unify360.com.au/' target='_blank'>
                <Image
                  src={Unify360}
                  alt='Unify 360'
                  title='Unify 360'
                  className={styles.instituteLogo}
                />
              </a>
              <a href='https://unify360.com.au/' target='_blank'>
                <Image
                  src={Unify360}
                  alt='Unify 360'
                  title='Unify 360'
                  className={styles.instituteLogo}
                />
              </a>
              <a href='https://unify360.com.au/' target='_blank'>
                <Image
                  src={Unify360}
                  alt='Unify 360'
                  title='Unify 360'
                  className={styles.instituteLogo}
                />
              </a>
              <a href='https://unify360.com.au/' target='_blank'>
                <Image
                  src={Unify360}
                  alt='Unify 360'
                  title='Unify 360'
                  className={styles.instituteLogo}
                />
              </a>
              <a href='https://unify360.com.au/' target='_blank'>
                <Image
                  src={Unify360}
                  alt='Unify 360'
                  title='Unify 360'
                  className={styles.instituteLogo}
                />
              </a>
              <a href='https://unify360.com.au/' target='_blank'>
                <Image
                  src={Unify360}
                  alt='Unify 360'
                  title='Unify 360'
                  className={styles.instituteLogo}
                />
              </a>
            </div>
          </div>
          {/* <div>
            <Typography variant={TypographyVariant.H3} color='var(--BondBlack)'>
              Level Silver
            </Typography>
          </div>
          <div>
            
          </div>
          <div>
            <Typography variant={TypographyVariant.H3} color='var(--BondBlack)'>
              Level Gold
            </Typography>
          </div>
          <div>
            
          </div> */}
        </div>
      </div>
    </div>
  );
}
