'use client';

import React, { useState } from 'react';
import styles from './handbook.module.css';
import handbookGraphSrc from '@/app/images/handbook-graph.png';
import handbookMobileSrc from '@/app/images/handbook-mobile.png';
import Image from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE, ENDORSEMENTS_CTA_LABELS } from '@/app/utilities/constants';
import { sendHandbookCtaClickEvent } from '@/app/utilities/gaTracking';
import { sendMetaHandbookCtaLeadEvent } from '@/app/utilities/metaPixelTracking';
import HandbookPopup from './HandbookPopup';

const HANDBOOK_CTA_SECTION = 'handbook';

const Handbook: React.FC = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const onPopupClose = () => {
    setPopupOpen(false);
  };

  const handleHandbookClick = () => {
    sendHandbookCtaClickEvent(HANDBOOK_CTA_SECTION);
    sendMetaHandbookCtaLeadEvent();
    setPopupOpen(true);
  };

  return (
    <div className={styles.container} id='handbook-container'>
      <div className={styles.textContainer}>
        <Image src={handbookGraphSrc} alt='Handbook Sample Graph' className={styles.graph} />
        <div className={styles.textContent}>
          <div className={styles.innerTextContent}>
            <Typography variant={TypographyVariant.H3} className={styles.header}>
              Neuro-Inclusion in Vocational Education
            </Typography>
            <Typography variant={TypographyVariant.Body3} className={styles.subtext}>
              Download our free handbook for practical strategies to build neuro-inclusive
              vocational education organisations.
            </Typography>
          </div>
          <ActionButton
            label={ENDORSEMENTS_CTA_LABELS.HANDBOOK}
            style={BUTTON_STYLE.Primary}
            onClick={handleHandbookClick}
          />
        </div>
      </div>
      <div className={styles.mobileContainer}>
        <Image src={handbookMobileSrc} alt='Handbook Mobile Screenshot' className={styles.mobile} />
      </div>
      <HandbookPopup open={popupOpen} onClose={onPopupClose} />
    </div>
  );
};

export default Handbook;
