import React from 'react';
import styles from './about.module.css';
import Typography, {
  TypographyVariant,
} from '../components/typography/Typography';
import Journey from '../components/aboutJourney/Journey';
import Values from '../components/aboutValues/Values';
import Mission from '../components/aboutMission/Mission';
import Vision from '../components/aboutVision/Vision';
// import Founders from '../components/aboutFounders/Founders';
import { Metadata } from 'next';
import { META_KEY } from '../utilities/constants';
import { createMetadata } from '../utilities/common';
import Advisors from '../components/aboutAdvisors/Advisors';
import Founders from '../components/aboutFounders/Founders';

export const metadata: Metadata = createMetadata(META_KEY.ABOUT, {
  images: [
    {
      url: 'https://neurostudyportal.s3.ap-southeast-2.amazonaws.com/images/Pratik.jpg',
    },
    {
      url: 'https://neurostudyportal.s3.ap-southeast-2.amazonaws.com/images/Will.jpg',
    },
  ],
});

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.text}>
          <Typography variant={TypographyVariant.H1}>About Us</Typography>
        </div>
        <div className={styles.subContainer}></div>
      </div>
      <div id="journey">
        <Journey />
      </div>
      <div id="values">
        <Values />
      </div>
      <div id="vision">
        <Vision />
      </div>
      <div id="mission">
        <Mission />
      </div>
      <div id="founders">
        <Founders />
      </div>
      <div id="advisors">
        <Advisors />
      </div>
    </div>
  );
}
