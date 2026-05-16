import Image from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import { TypographyColorToken } from '../typography/typographyColorToken';
import vetHeaderIcon from '@/app/images/emergingInstitutions/vet-key-data-points-header-icon.svg';
import strengthStyles from './endorsedNdExperienceStrengths.module.css';
import statsStyles from '../emergingInstitutions/emergingInstitutions.module.css';
import type { VetKeyDataPoint } from './endorsedProviderPageData';
import styles from './endorsedVetKeyDataPoints.module.css';

interface EndorsedVetKeyDataPointsProps {
  dataPoints: VetKeyDataPoint[];
}

const VET_TITLE_LINE_1 = '6 Key Data Points –';
const VET_TITLE_LINE_2 = 'Neurodiversity & Disability in VET';

const VET_SECTION_INTRO = 
  <>Insights into vocational education to help neurodivergent students understand why endorsed organisations may be a good fit.<br /><span className={styles.bottomLine}>Source: NCVER, AIHW, and ABS education and disability data.</span></>;


export default function EndorsedVetKeyDataPoints({
  dataPoints,
}: EndorsedVetKeyDataPointsProps) {
  if (dataPoints.length === 0) {
    return null;
  }

  return (
    <section
      className={styles.vetSection}
      aria-labelledby='vet-key-data-heading'
    >
      <div className={statsStyles.providerStatsContainerInAlignedColumn}>
        <header className={styles.headerBlock}>
          <div className={styles.titleRow}>
            <div className={styles.headerIcon}>
              <Image
                src={vetHeaderIcon}
                alt=''
                fill
                unoptimized
                className={styles.headerIconImage}
              />
            </div>
            <Typography
              id='vet-key-data-heading'
              variant={TypographyVariant.H2}
              color={TypographyColorToken.BondBlack}
              className={styles.headerTitle}
            >
              <span className={styles.headerTitleLine}>{VET_TITLE_LINE_1}</span>
              <span className={styles.headerTitleLine}>{VET_TITLE_LINE_2}</span>
            </Typography>
          </div>
          <Typography
            variant={TypographyVariant.Body2Strong}
            color={TypographyColorToken.BondBlack}
            className={styles.headerIntro}
          >
            {VET_SECTION_INTRO}
          </Typography>
        </header>
        <ul className={styles.vetStrengthsGrid}>
          {dataPoints.map((point) => (
            <li key={point.id} className={styles.vetStatCard}>
              <div className={strengthStyles.strengthCardIcon}>
                <Image
                  src={point.icon}
                  alt=''
                  fill
                  quality={100}
                  unoptimized
                  sizes='(max-width: 767px) 45vw, 200px'
                  className={styles.vetStatIcon}
                />
              </div>
              <Typography
                variant={TypographyVariant.Body1}
                color={TypographyColorToken.BondBlack}
                className={styles.vetHeadline}
              >
                {point.headline}
              </Typography>
              <Typography
                variant={TypographyVariant.Body3}
                color={TypographyColorToken.BondBlack}
                className={styles.vetTitle}
              >
                {point.title}
              </Typography>
              <Typography
                variant={TypographyVariant.Body3}
                color={TypographyColorToken.BondBlack}
                className={styles.vetSupportingText}
              >
                {point.description}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
