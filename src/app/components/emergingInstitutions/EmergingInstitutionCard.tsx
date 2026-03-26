import styles from './emergingInstitutions.module.css';
import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import Typography, { TypographyVariant } from '../typography/Typography';

type EmergingInstitutionCardProps = {
  name: string;
  pdfUrl: string;
};

export default function EmergingInstitutionCard({
  name,
  pdfUrl,
}: EmergingInstitutionCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop} />
      <div className={styles.cardBody}>
        <div className={styles.nameWrap}>
          <Typography variant={TypographyVariant.Body2}>{name}</Typography>
        </div>
        <ActionButton
          label='Explore More'
          style={BUTTON_STYLE.Primary}
          className={styles.ctaButton}
          to={pdfUrl}
          openInNewTab={true}
        />
      </div>
    </div>
  );
}
