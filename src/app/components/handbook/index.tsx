'use client';

import React from 'react';
import styles from './handbook.module.css';
import handbookGraphSrc from '@/app/images/handbook-graph.png';
import handbookMobileSrc from '@/app/images/handbook-mobile.png';
import Image from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';

const Handbook: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <Image
          src={handbookGraphSrc}
          alt='Handbook Sample Graph'
          className={styles.graph}
        />
        <Typography variant={TypographyVariant.H3} className={styles.header}>
          Neuro-Inclusion in Vocational Education
        </Typography>
        <div className={styles.subtext}>
          Explore key strategies for building neuro-inclusive vocational
          education organizations in our <b>free</b> handbook.
        </div>
        <ActionButton
          label='Free Download'
          style={BUTTON_STYLE.Primary}
          disabled
        />
      </div>
      <div>
        <Image
          src={handbookMobileSrc}
          alt='Handbook Mobile Screenshot'
          className={styles.mobile}
        />
      </div>
    </div>
  );
};

export default Handbook;
