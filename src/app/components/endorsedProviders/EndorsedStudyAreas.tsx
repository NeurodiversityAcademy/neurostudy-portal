import Typography, { TypographyVariant } from '../typography/Typography';
import { TypographyColorToken } from '../typography/typographyColorToken';
import styles from './endorsedProviderEnhancements.module.css';

interface EndorsedStudyAreasProps {
  studyAreas: string[];
}

export default function EndorsedStudyAreas({
  studyAreas,
}: EndorsedStudyAreasProps) {
  if (studyAreas.length === 0) {
    return null;
  }

  return (
    <section
      className={styles.studyAreasSection}
      aria-labelledby='endorsed-study-areas-heading'
    >
      <Typography
        id='endorsed-study-areas-heading'
        variant={TypographyVariant.H3}
        color={TypographyColorToken.BondBlack}
        className={styles.studyAreasTitle}
      >
        Study Areas
      </Typography>
      <ul className={styles.studyAreasList}>
        {studyAreas.map((area) => (
          <li key={area} className={styles.studyAreasPill}>
            <Typography
              variant={TypographyVariant.Body3}
              color={TypographyColorToken.BondBlackVariant}
            >
              {area}
            </Typography>
          </li>
        ))}
      </ul>
    </section>
  );
}
