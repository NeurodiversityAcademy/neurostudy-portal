import React from 'react';
import styles from './page.module.css';
import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';
import { Metadata } from 'next';
import { META_KEY } from '../../../app/utilities/constants';
import { createMetadata } from '@/app/utilities/common';
import Subscribe from '@/app/components/subscribe/subscribe';
import Contact from '@/app/components/contact/Contact';

export const metadata: Metadata = createMetadata(META_KEY.COACHING);

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Typography variant={TypographyVariant.H1} color='var(--BondBlack)'>
          Career Coaching
        </Typography>
      </div>
      <div className={styles.bodyText}>
        <div className={styles.serviceDescription}>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlack)'
          >
            Give supportive advice on different pathways to take as a
            neurodivergent person to achieve career success or growth
            opportunities in the competitive world
          </Typography>
        </div>
      </div>
      <Contact />
      <Subscribe />
    </div>
  );
}
