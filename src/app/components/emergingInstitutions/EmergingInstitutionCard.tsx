import InstitutionProviderCard from '../institutionProviderCard/InstitutionProviderCard';
import styles from '../institutionProviderCard/institutionProviderCard.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';

type EmergingInstitutionCardProps = {
  name: string;
  href: string;
};

export default function EmergingInstitutionCard({
  name,
  href,
}: EmergingInstitutionCardProps) {
  return (
    <InstitutionProviderCard
      pdfUrl={pdfUrl}
      header={{ kind: 'emergingDefault' }}
      center={
        <div className={styles.nameWrap}>
          <Typography variant={TypographyVariant.Body2}>{name}</Typography>
        </div>
      }
    />
  );
}
