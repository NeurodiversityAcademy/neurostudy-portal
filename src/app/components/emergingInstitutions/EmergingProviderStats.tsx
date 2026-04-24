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
          Student Experience Highlights<sup>*</sup>
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
              <Typography variant={TypographyVariant.Body3Strong}>
                {stat.title}
              </Typography>
              <div className={styles.providerStatsMeta}>
                <Typography
                  variant={TypographyVariant.Body3}
                  color='var(--BondBlackVariant)'
                >
                  National Average {stat.nationalAverage}
                </Typography>
                <Typography
                  variant={TypographyVariant.Body3}
                  color='var(--BondBlackVariant)'
                >
                  Responses {stat.responses}
                </Typography>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
