import Typography, { TypographyVariant } from '../typography/Typography';
import { TypographyColorToken } from '../typography/typographyColorToken';
import type {
  EndorsedNdExperience,
  TopStrengthArea,
} from './endorsedProviderPageData';
import TopStrengthAreaIcon from './TopStrengthAreaIcon';
import styles from './endorsedNdExperienceStrengths.module.css';

interface EndorsedNdExperienceStrengthsProps {
  experience: EndorsedNdExperience;
  topStrengths: TopStrengthArea[];
  /** Tighter spacing when rendered directly after the VET key data points block. */
  followsVetKeyDataPoints?: boolean;
}

export default function EndorsedNdExperienceStrengths({
  experience,
  topStrengths,
  followsVetKeyDataPoints = false,
}: EndorsedNdExperienceStrengthsProps) {
  const bands = experience.performanceBands;
  const sectionClassName = followsVetKeyDataPoints
    ? `${styles.section} ${styles.sectionFollowingVet}`
    : styles.section;

  return (
    <section
      className={sectionClassName}
      aria-labelledby='endorsed-nd-experience-heading'
    >
      <Typography
        id='endorsed-nd-experience-heading'
        variant={TypographyVariant.H3}
        color={TypographyColorToken.BondBlack}
        className={styles.title}
      >
        {experience.heading}
      </Typography>

      <Typography
        variant={TypographyVariant.Body3}
        color={TypographyColorToken.BondBlackVariant}
        className={styles.paragraph}
      >
        {experience.summary}
      </Typography>
      <Typography
        variant={TypographyVariant.Body3}
        color={TypographyColorToken.BondBlackVariant}
        className={styles.paragraph}
      >
        {experience.contextNote}
      </Typography>

      <Typography
        variant={TypographyVariant.Body2Strong}
        color={TypographyColorToken.BondBlack}
        className={styles.subheading}
      >
        Survey areas include:
      </Typography>
      <ol className={styles.surveyList}>
        {experience.surveyAreas.map((area) => (
          <li key={area}>
            <Typography
              variant={TypographyVariant.Body3}
              color={TypographyColorToken.BondBlackVariant}
            >
              {area}
            </Typography>
          </li>
        ))}
      </ol>

      {bands ? (
        <>
          <Typography
            variant={TypographyVariant.Body2Strong}
            color={TypographyColorToken.BondBlack}
            className={styles.subheading}
          >
            Performance levels:
          </Typography>
          <ul className={styles.legendList}>
            <li>
              <Typography
                variant={TypographyVariant.Body3}
                color={TypographyColorToken.BondBlackVariant}
              >
                {bands.low}
              </Typography>
            </li>
            <li>
              <Typography
                variant={TypographyVariant.Body3}
                color={TypographyColorToken.BondBlackVariant}
              >
                {bands.medium}
              </Typography>
            </li>
            <li>
              <Typography
                variant={TypographyVariant.Body3}
                color={TypographyColorToken.BondBlackVariant}
              >
                {bands.high}
              </Typography>
            </li>
          </ul>
        </>
      ) : null}

      <Typography
        variant={TypographyVariant.Body3}
        color={TypographyColorToken.BondBlackVariant}
        className={styles.responseNote}
      >
        {experience.responseSummary}
      </Typography>

      {topStrengths.length > 0 ? (
        <ul className={styles.strengthsGrid}>
          {topStrengths.map((item) => (
            <li key={item.title} className={styles.strengthCard}>
              <div className={styles.strengthCardIcon}>
                <TopStrengthAreaIcon kind={item.iconKind} />
              </div>
              <Typography
                variant={TypographyVariant.Body3}
                color={TypographyColorToken.PureWhite}
                className={styles.strengthCardTitle}
              >
                {item.title}
              </Typography>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
