import Image, { StaticImageData } from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import { QILT_SURVEY_2024_LABEL } from './emergingProviderQiltSource';
import styles from './emergingProviderDetail.module.css';

export type ProviderStatItem = {
  icon: StaticImageData;
  value: string;
  title: string;
  nationalAverage: string;
  responses: string;
};

type EmergingProviderStatsProps = {
  stats: ProviderStatItem[];
  isAlignedWithPageColumn?: boolean;
  /** Compared.edu (or other) QILT source page; omit to show plain-text attribution. */
  sourceHref?: string;
};

export default function EmergingProviderStats({
  stats,
  isAlignedWithPageColumn = false,
  sourceHref,
}: EmergingProviderStatsProps) {
  const sectionClassName = isAlignedWithPageColumn
    ? styles.providerStatsSectionAligned
    : styles.providerStatsSection;

  const containerClassName = isAlignedWithPageColumn
    ? styles.providerStatsContainerInAlignedColumn
    : styles.providerStatsContainer;

  return (
    <section className={sectionClassName}>
      <div className={containerClassName}>
        <Typography
          variant={TypographyVariant.H3}
          color='var(--BondBlack)'
          className={styles.providerStatsHeading}
        >
          Student Delivery Signals<sup>*</sup>
        </Typography>
        <div className={styles.providerStatsGrid}>
          {stats.map((stat) => (
            <article key={stat.title} className={styles.providerStatsCard}>
              <Image
                src={stat.icon}
                alt=''
                width={stat.icon.width}
                height={stat.icon.height}
                quality={100}
                unoptimized
                sizes='(max-width: 767px) 45vw, 200px'
                className={styles.providerStatsIcon}
              />
              <Typography
                variant={TypographyVariant.Body1}
                color='var(--BondBlack)'
                className={styles.providerStatsValue}
              >
                {stat.value}
              </Typography>
              <Typography
                variant={TypographyVariant.Body3}
                color='var(--BondBlack)'
                className={styles.providerStatsTitle}
              >
                {stat.title}
              </Typography>
              <div className={styles.providerStatsMeta}>
                <Typography
                  variant={TypographyVariant.Body3}
                  color='var(--BondBlack)'
                  className={styles.providerStatsNational}
                >
                  National Average {stat.nationalAverage}
                </Typography>
                <Typography
                  variant={TypographyVariant.Body3}
                  color='var(--BondBlack)'
                  className={styles.providerStatsResponses}
                >
                  <span className={styles.providerStatsResponsesLabel}>Responses</span>{' '}
                  {stat.responses}
                </Typography>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.providerStatsDisclaimer}>
          <Typography
            variant={TypographyVariant.Body3}
            color='var(--BondBlack)'
            className={styles.providerStatsDisclaimerLine}
          >
            <sup>*</sup>Based on Undergraduate Student Experience Survey data
          </Typography>
          <Typography
            variant={TypographyVariant.Body3}
            color='var(--BondBlack)'
            className={styles.providerStatsDisclaimerLine}
          >
            Source:{' '}
            {sourceHref ? (
              <a
                href={sourceHref}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.providerStatsDisclaimerLink}
              >
                {QILT_SURVEY_2024_LABEL}
              </a>
            ) : (
              QILT_SURVEY_2024_LABEL
            )}
          </Typography>
        </div>
      </div>
    </section>
  );
}
