import styles from './page.module.css';
import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';
import { Metadata } from 'next';
import { META_KEY } from '../../../app/utilities/constants';
import { createMetadata } from '@/app/utilities/common';
import Subscribe from '@/app/components/subscribe/subscribe';
import Contact from '@/app/components/contact/Contact';

export const metadata: Metadata = createMetadata(META_KEY.NETWORKING);

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Typography variant={TypographyVariant.H1} color='var(--BondBlack)'>
          Host Neurodiversity Workshops & Networking (Awareness/Education)
        </Typography>
      </div>
      <div className={styles.bodyText}>
        <p>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlack)'
          >
            Hold regular networking and workshop events in person and online,
            designed to promote awareness and educate people around
            Neurodiversity
          </Typography>
        </p>
      </div>
      <Contact />
      <Subscribe />
    </div>
  );
}
