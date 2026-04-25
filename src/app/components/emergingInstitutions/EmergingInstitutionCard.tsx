import InstitutionProviderCard, {
  INSTITUTION_PROVIDER_HEADER_KIND,
} from '../institutionProviderCard/InstitutionProviderCard';
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
      pdfUrl={href}
      header={{ kind: INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT }}
      center={
        <div className={styles.nameWrap}>
          <Typography variant={TypographyVariant.Body2}>{name}</Typography>
        </div>
      }
    />
  );
}
