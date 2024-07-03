import styles from './page.module.css';
import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';
import { Metadata } from 'next';
import { createMetadata } from '@/app/utilities/common';
import { META_KEY } from '@/app/utilities/constants';
import Subscribe from '@/app/components/subscribe/subscribe';
import Contact from '@/app/components/contact/Contact';

export const metadata: Metadata = createMetadata(
  META_KEY.NEURODIVERSITY_TRAINING
);

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Typography variant={TypographyVariant.H1} color='var(--BondBlack)'>
          Neurodiversity Learning/Training Partnerships
        </Typography>
      </div>
      <div className={styles.bodyText}>
        <p>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlack)'
          >
            Have a range of different course of study (certifications and
            qualifications) available to help neurodivergent people get skilled
            in different areas. Along with partnering with schools,
            organisations and universities to help with career progression and
            achieving higher levels of innovations and excellence.
          </Typography>
        </p>
      </div>
      <Contact />
      <Subscribe />
    </div>
  );
}
