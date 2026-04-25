import styles from './emergingInstitutions.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import EmergingInstitutionCtaButton from './EmergingInstitutionCtaButton';

type EmergingInstitutionCardProps = {
  name: string;
  href: string;
};

export default function EmergingInstitutionCard({
  name,
  href,
}: EmergingInstitutionCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop} />
      <div className={styles.cardBody}>
        <div className={styles.nameWrap}>
          <Typography variant={TypographyVariant.Body2}>{name}</Typography>
        </div>
        <EmergingInstitutionCtaButton
          href={href}
          institutionName={name}
          className={styles.ctaButton}
        />
      </div>
    </div>
  );
}
