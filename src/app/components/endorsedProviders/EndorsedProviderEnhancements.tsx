import Image from 'next/image';

import Typography, { TypographyVariant } from '../typography/Typography';
import { TypographyColorToken } from '../typography/typographyColorToken';
import type { SupportFrameworkSection } from './endorsedProviderPageData';
import styles from './endorsedProviderEnhancements.module.css';
import { getSupportFrameworkSectionIcon } from './supportFrameworkSectionIcons';

interface EndorsedProviderEnhancementsProps {
  supportFramework: SupportFrameworkSection[];
}

export default function EndorsedProviderEnhancements({
  supportFramework,
}: EndorsedProviderEnhancementsProps) {
  const hasAnySection = supportFramework.length > 0;

  if (!hasAnySection) {
    return null;
  }

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

      {supportFramework.length > 0 ? (
        <article className={styles.supportFrameworkCard}>
          <div className={styles.frameworkHeader}>
            <Typography
              variant={TypographyVariant.Body2Strong}
              color={TypographyColorToken.BondBlack}
            >
              Area
            </Typography>
            <Typography
              variant={TypographyVariant.Body2Strong}
              color={TypographyColorToken.BondBlack}
            >
              Supports in place
            </Typography>
            <Typography
              variant={TypographyVariant.Body2Strong}
              color={TypographyColorToken.BondBlack}
            >
              In the works
            </Typography>
          </div>
          {supportFramework.map((frameworkSection, index) => {
            const sectionIcon = getSupportFrameworkSectionIcon(
              frameworkSection.section
            );

            return (
              <div
                key={frameworkSection.section}
                className={`${styles.frameworkRow} ${
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
                <div className={styles.frameworkItemsCell}>
                  <ul className={styles.frameworkList}>
                    {frameworkSection.items
                      .filter((item) => item.status === 'Supports in place')
                      .map((item) => (
                        <li key={item.label}>{item.label}</li>
                      ))}
                  </ul>
                </div>
                <div className={styles.frameworkItemsCell}>
                  <ul className={styles.frameworkList}>
                    {frameworkSection.items
                      .filter((item) => item.status === 'In the works')
                      .map((item) => (
                        <li key={item.label}>{item.label}</li>
                      ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </article>
      ) : null}

      {/* Staff nominations section intentionally hidden for now; data is retained. */}
    </section>
  );
}
