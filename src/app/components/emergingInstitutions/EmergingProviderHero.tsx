import { StaticImageData } from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './emergingInstitutions.module.css';
import bannerStyles from '@/app/components/banner/banner.module.css';
import classNames from 'classnames';
import CourseDetailsMiddleBannerIcon from '@/app/components/course/CourseDetails/CourseDetailsMiddleBanner/CourseDetailsMiddleBannerIcon';
import mapPin from '@/app/images/MapPin.png';
import hourglass from '@/app/images/Hourglass.png';
import clockCountdown from '@/app/images/ClockCountdown.png';
import notebook from '@/app/images/Notebook.png';
import currencyCircleDollar from '@/app/images/CurrencyCircleDollar.png';

export type HeroInfoItem = {
  icon: StaticImageData;
  value: string;
  label: string;
};

type EmergingProviderHeroProps = {
  title: string;
  heroInfoItems: HeroInfoItem[];
};

export default function EmergingProviderHero({
  title,
  heroInfoItems,
}: EmergingProviderHeroProps) {
  const iconByLabel: Record<string, StaticImageData> = {
    Location: mapPin,
    Duration: hourglass,
    'Application End': clockCountdown,
    Subjects: notebook,
    Fees: currencyCircleDollar,
  };

  const statOrder = [
    'Location',
    'Duration',
    'Application End',
    'Subjects',
    'Fees',
  ] as const;

  const orderedStatItems = statOrder
    .map((label) => heroInfoItems.find((item) => item.label === label))
    .filter((item): item is HeroInfoItem => Boolean(item));

  return (
    <section className={styles.providerHeroSection}>
      <div
        className={classNames(
          bannerStyles.bannerContainer,
          styles.providerHeroBanner
        )}
      >
        <div className={styles.providerHeroCoverContent}>
          <Typography
            variant={TypographyVariant.H1}
            color='var(--GhostWhite)'
            className={styles.providerHeroTitle}
          >
            {title}
          </Typography>
        </div>
      </div>
      <div className={styles.providerHeroStatsBelow}>
        <div className={styles.providerHeroStats}>
          {orderedStatItems.map((item, index) => (
            <CourseDetailsMiddleBannerIcon
              key={`${item.label}-${index}`}
              src={iconByLabel[item.label]}
              alt=''
              title={item.value}
              description={item.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
