import Image, { StaticImageData } from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import styles from './emergingInstitutions.module.css';
import bannerStyles from '@/app/components/banner/banner.module.css';
import classNames from 'classnames';
import CourseDetailsMiddleBannerIcon from '@/app/components/course/CourseDetails/CourseDetailsMiddleBanner/CourseDetailsMiddleBannerIcon';
import mapPin from '@/app/images/MapPin.png';
import notebook from '@/app/images/Notebook.png';
import emergingProvidersLogo from '@/app/images/emergingProviders.jpeg';

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
    Type: notebook,
  };

  const locationItem = heroInfoItems.find((item) => item.label === 'Location');
  const typeItem = heroInfoItems.find((item) => item.label === 'Type');

  return (
    <section className={styles.providerHeroSection}>
      <div
        className={classNames(
          bannerStyles.bannerContainer,
          styles.providerHeroBanner
        )}
      >
        <div className={styles.providerHeroCoverContent}>
          <div className={styles.providerHeroCoverInner}>
            <div className={styles.providerHeroInstitutionCol}>
              <Typography
                variant={TypographyVariant.H1}
                color='var(--GhostWhite)'
                className={styles.providerHeroInstitutionName}
              >
                ({title})
              </Typography>
            </div>
            <div className={styles.providerHeroTaglineCol}>
              <Typography
                variant={TypographyVariant.H3}
                color='var(--GhostWhite)'
                className={styles.providerHeroTagline}
              >
                Organisations Showing
                <br />
                Potential for
                <br />
                Neuro-Inclusive
                <br />
                Education
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.providerHeroStatsBelow}>
        <div className={styles.providerHeroStats}>
          <div className={styles.providerHeroStatSlotLeft}>
            {typeItem ? (
              <CourseDetailsMiddleBannerIcon
                src={iconByLabel.Type}
                alt=''
                title={typeItem.label}
                description={typeItem.value}
              />
            ) : null}
          </div>
          <div className={styles.providerHeroCenterLogo}>
            <Image
              src={emergingProvidersLogo}
              alt='Emerging Providers'
              width={emergingProvidersLogo.width}
              height={emergingProvidersLogo.height}
              className={styles.providerHeroCenterLogoImg}
              priority
            />
          </div>
          <div className={styles.providerHeroStatSlotRight}>
            {locationItem ? (
              <CourseDetailsMiddleBannerIcon
                src={iconByLabel.Location}
                alt=''
                title={locationItem.label}
                description={locationItem.value}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
