import Image from 'next/image';

import Typography, { TypographyVariant } from '../typography/Typography';
import { TypographyColorToken } from '../typography/typographyColorToken';
import type { SupportFrameworkSection } from './endorsedProviderPageData';
import styles from './endorsedProviderEnhancements.module.css';
import { getSupportFrameworkSectionIcon } from './supportFrameworkSectionIcons';

interface EndorsedProviderEnhancementsProps {
  supportFramework: SupportFrameworkSection[];
  ndaCertified?: boolean;
}

const NDA_APPROVED_TRAINING_LABEL = 'NDA-approved training';

function NdaCertifiedTrainingMark() {
  return (
    <span className={styles.ndaCertifiedMark}>
      <svg
        className={styles.ndaCertifiedMarkStar}
        viewBox='0 0 24 24'
        aria-hidden='true'
        focusable='false'
      >
        <path
          fill='currentColor'
          d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
        />
      </svg>
      NDA Certified
    </span>
  );
}

function renderSupportFrameworkItem(
  item: SupportFrameworkSection['items'][number],
  ndaCertified: boolean
) {
  const showCertifiedMark =
    ndaCertified &&
    item.label === NDA_APPROVED_TRAINING_LABEL &&
    item.status === 'Supports in place';

  return (
    <li key={item.label} className={styles.frameworkListItem}>
      <span>{item.label}</span>
      {showCertifiedMark ? <NdaCertifiedTrainingMark /> : null}
    </li>
  );
}

function partitionSupportItems(section: SupportFrameworkSection) {
  const supportsInPlace = section.items.filter(
    (item) => item.status === 'Supports in place'
  );
  const inTheWorks = section.items.filter(
    (item) => item.status === 'In the works'
  );
  return { supportsInPlace, inTheWorks };
}

export default function EndorsedProviderEnhancements({
  supportFramework,
  ndaCertified = false,
}: EndorsedProviderEnhancementsProps) {
  const rows = supportFramework
    .map((frameworkSection) => ({
      frameworkSection,
      ...partitionSupportItems(frameworkSection),
    }))
    .filter(
      ({ supportsInPlace, inTheWorks }) =>
        supportsInPlace.length > 0 || inTheWorks.length > 0
    );

  if (rows.length === 0) {
    return null;
  }

  const showSupportsColumn = rows.some(
    ({ supportsInPlace }) => supportsInPlace.length > 0
  );
  const showInWorksColumn = rows.some(
    ({ inTheWorks }) => inTheWorks.length > 0
  );
  const useThreeColumns = showSupportsColumn && showInWorksColumn;

  const gridColsClass = useThreeColumns
    ? styles.frameworkGridCols3
    : styles.frameworkGridCols2;

  return (
    <section className={styles.section} aria-labelledby='endorsed-more-heading'>
      <Typography
        id='endorsed-more-heading'
        variant={TypographyVariant.H2}
        color={TypographyColorToken.BondBlack}
        className={styles.heading}
      >
        Endorsed Provider Insights
      </Typography>

      <article className={styles.supportFrameworkCard}>
        <div className={`${styles.frameworkHeader} ${gridColsClass}`}>
          <Typography
            variant={TypographyVariant.Body2Strong}
            color={TypographyColorToken.BondBlack}
          >
            Area
          </Typography>
          {showSupportsColumn ? (
            <Typography
              variant={TypographyVariant.Body2Strong}
              color={TypographyColorToken.BondBlack}
            >
              Supports in place
            </Typography>
          ) : null}
          {showInWorksColumn ? (
            <Typography
              variant={TypographyVariant.Body2Strong}
              color={TypographyColorToken.BondBlack}
            >
              In the works
            </Typography>
          ) : null}
        </div>
        {rows.map(
          ({ frameworkSection, supportsInPlace, inTheWorks }, index) => {
            const sectionIcon = getSupportFrameworkSectionIcon(
              frameworkSection.section
            );
            const showSupportsCell = supportsInPlace.length > 0;
            const showInWorksCell = inTheWorks.length > 0;
            const supportsCellFirst = showSupportsCell;
            const inWorksCellFirst = !showSupportsCell && showInWorksCell;

            return (
              <div
                key={frameworkSection.section}
                className={`${styles.frameworkRow} ${gridColsClass} ${
                  index % 2 === 1 ? styles.frameworkRowAlt : ''
                }`}
              >
                <div className={styles.frameworkAreaCell}>
                  {sectionIcon ? (
                    <div className={styles.frameworkAreaIconWrap}>
                      <Image
                        src={sectionIcon}
                        alt=''
                        fill
                        className={styles.frameworkAreaIconImage}
                        sizes='(max-width: 767px) 80px, 72px'
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <Typography
                    variant={TypographyVariant.Body2Strong}
                    color={TypographyColorToken.BondBlack}
                    className={styles.frameworkAreaTitle}
                  >
                    {frameworkSection.section}
                  </Typography>
                </div>
                {showSupportsColumn ? (
                  showSupportsCell ? (
                    <div
                      className={`${styles.frameworkItemsCell} ${
                        supportsCellFirst ? styles.frameworkItemsCellFirst : ''
                      }`}
                    >
                      <Typography
                        variant={TypographyVariant.Body2Strong}
                        color={TypographyColorToken.BondBlack}
                        className={styles.frameworkColumnHeadingMobile}
                      >
                        Supports in place
                      </Typography>
                      <ul className={styles.frameworkList}>
                        {supportsInPlace.map((item) =>
                          renderSupportFrameworkItem(item, ndaCertified)
                        )}
                      </ul>
                    </div>
                  ) : useThreeColumns ? (
                    <div
                      className={styles.frameworkItemsCellPlaceholder}
                      aria-hidden='true'
                    />
                  ) : null
                ) : null}
                {showInWorksColumn ? (
                  showInWorksCell ? (
                    <div
                      className={`${styles.frameworkItemsCell} ${
                        inWorksCellFirst ? styles.frameworkItemsCellFirst : ''
                      }`}
                    >
                      <Typography
                        variant={TypographyVariant.Body2Strong}
                        color={TypographyColorToken.BondBlack}
                        className={styles.frameworkColumnHeadingMobile}
                      >
                        In the works
                      </Typography>
                      <ul className={styles.frameworkList}>
                        {inTheWorks.map((item) => (
                          <li key={item.label}>{item.label}</li>
                        ))}
                      </ul>
                    </div>
                  ) : useThreeColumns ? (
                    <div
                      className={styles.frameworkItemsCellPlaceholder}
                      aria-hidden='true'
                    />
                  ) : null
                ) : null}
              </div>
            );
          }
        )}
      </article>

      {/* Staff nominations section intentionally hidden for now; data is retained. */}
    </section>
  );
}
