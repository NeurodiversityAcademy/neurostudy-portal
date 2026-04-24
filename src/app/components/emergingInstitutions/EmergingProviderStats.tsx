import Image, { StaticImageData } from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './emergingInstitutions.module.css';

export type ProviderStatItem = {
  icon: StaticImageData;
  value: string;
  title: string;
  nationalAverage: string;
  responses: string;
};

type EmergingProviderStatsProps = {
  stats: ProviderStatItem[];
};

export default function EmergingProviderStats({
  stats,
}: EmergingProviderStatsProps) {
  return (
    <section className={styles.providerStatsSection}>
      <div className={styles.providerStatsContainer}>
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
                variant={TypographyVariant.Body3Strong}
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
                  variant={TypographyVariant.Body3Strong}
                  color='var(--BondBlack)'
                  className={styles.providerStatsResponses}
                >
                  Responses {stat.responses}
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
            Based on Undergraduate Student Experience Survey data
          </Typography>
          <Typography
            variant={TypographyVariant.Body3}
            color='var(--BondBlack)'
            className={styles.providerStatsDisclaimerLine}
          >
            Source:{' '}
            <a
              href='https://www.compared.edu.au/institution/bond-university/undergraduate'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.providerStatsDisclaimerLink}
            >
              Quilt survey 2024
            </a>
          </Typography>
        </div>
      </div>
    </section>
  );
}
