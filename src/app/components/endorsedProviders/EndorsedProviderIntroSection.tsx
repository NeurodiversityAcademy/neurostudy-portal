import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './endorsedProviderIntroSection.module.css';

export interface EndorsedProviderIntroSectionProps {
  heading: string;
  body: string;
}

export default function EndorsedProviderIntroSection({
  heading,
  body,
}: EndorsedProviderIntroSectionProps) {
  return (
    <section
      className={styles.section}
      aria-labelledby='endorsed-provider-intro-heading'
    >
      <Typography
        id='endorsed-provider-intro-heading'
        variant={TypographyVariant.H2}
        color='var(--BondBlack)'
        className={styles.heading}
      >
        {heading}
      </Typography>
      <Typography
        variant={TypographyVariant.Body3}
        color='var(--BondBlackVariant)'
        className={styles.body}
      >
        {body}
      </Typography>
    </section>
  );
}
