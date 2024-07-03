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

export const metadata: Metadata = createMetadata(META_KEY.ADVISORY_CONSULTING);

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Typography variant={TypographyVariant.H1} color='var(--BondBlack)'>
          Advisory Neurodiversity Consulting
        </Typography>
      </div>
      <div className={styles.bodyText}>
        <Typography variant={TypographyVariant.Body1} color='var(--BondBlack)'>
          Provide advisory services regarding Neurodiversity in areas of
        </Typography>
        <ul className={styles.serviceDescriptionList}>
          <li>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--BondBlack)'
            >
              Inclusive workplace design and setup
            </Typography>
          </li>
          <li>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--BondBlack)'
            >
              Neurodiversity Awareness to Employers/Employees
            </Typography>
          </li>
          <li>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--BondBlack)'
            >
              Recruitment and Placements
            </Typography>
          </li>
          <li>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--BondBlack)'
            >
              Assistive Technology utilisation for learning difficulties
            </Typography>
          </li>
          <li>
            <Typography
              variant={TypographyVariant.Body2}
              color='var(--BondBlack)'
            >
              Adult Education and Career planning guidance
            </Typography>
          </li>
        </ul>
      </div>
      <Contact />
      <Subscribe />
    </div>
  );
}
