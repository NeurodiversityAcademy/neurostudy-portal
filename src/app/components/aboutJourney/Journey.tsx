import React from 'react';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './journey.module.css';

export default function Journey() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant={TypographyVariant.H2}>Our Journey</Typography>
      </div>
      <div>
        <div className={styles.paragraph}>
          <Typography variant={TypographyVariant.Body1}>
            Founder Will Wheeler, as a neurodistinct individual, encountered
            frustration while pursuing adult education due to a lack of
            understanding and support. His journey in VET education since 2009
            revealed an industry desire to assist neurodistinct students, yet a
            notable deficiency in comprehension and knowledge for effective
            support.
          </Typography>
        </div>
        <div className={styles.paragraph}>
          <Typography variant={TypographyVariant.Body1}>
            Recognizing this gap, Will Wheeler, alongside co-founder Pratik
            Bhumkar, established Neurodiversity Academy, a social enterprise
            technology company. The primary objective of this academy is to
            enhance learning organizations&apos; understanding of
            neurodiversity, bridging the gap between them and neurodistinct
            individuals. The aim is to create a supportive and inclusive
            learning environment for neurodistinct students, fostering an
            atmosphere where they can comfortably pursue their career
            aspirations
          </Typography>
        </div>
        <div className={styles.paragraph}>
          <Typography variant={TypographyVariant.Body1}>
            Neurodiversity Academy, under the guidance of Will and Pratik, seeks
            to revolutionize the educational landscape, ensuring that
            neurodistinct individuals not only receive proper support but also
            find an environment that nurtures their unique strengths and
            talents. Through their advocacy and technological solutions, the
            academy endeavors to empower neurodistinct students to thrive in
            their educational journeys and achieve their professional
            dreams.{' '}
          </Typography>
        </div>
      </div>
    </div>
  );
}
