'use client';

import React, { useState } from 'react';
import styles from './handbook.module.css';
import handbookGraphSrc from '@/app/images/handbook-graph.png';
import handbookMobileSrc from '@/app/images/handbook-mobile.png';
import Image from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import HandbookPopup from './HandbookPopup';

const Handbook: React.FC = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const onPopupClose = () => {
    setPopupOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <Image
          src={handbookGraphSrc}
          alt='Handbook Sample Graph'
          className={styles.graph}
        />
        <div className={styles.textContent}>
          <div className={styles.innerTextContent}>
            <Typography
              variant={TypographyVariant.H3}
              className={styles.header}
            >
              Neuro-Inclusion in Vocational Education
            </Typography>
            <Typography
              variant={TypographyVariant.Body3}
              className={styles.subtext}
            >
              Explore key strategies for building neuro-inclusive vocational
              education organizations in our <b>free</b> handbook.
            </Typography>
          </div>
          <ActionButton
            label='Free Download'
            style={BUTTON_STYLE.Primary}
            onClick={() => setPopupOpen(true)}
          />
        </div>
      </div>
      <div className={styles.mobileContainer}>
        <Image
          src={handbookMobileSrc}
          alt='Handbook Mobile Screenshot'
          className={styles.mobile}
        />
      </div>
      <HandbookPopup
        open={popupOpen}
        isLoading={false}
        onClose={onPopupClose}
      />
    </div>
  );
};

export default Handbook;
