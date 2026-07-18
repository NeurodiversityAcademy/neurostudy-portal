import Image, { StaticImageData } from 'next/image';
import classNames from 'classnames';
import Typography, { TypographyVariant } from '../typography/Typography';
import { TypographyColorToken } from '../typography/typographyColorToken';
import styles from './emergingInstitutions.module.css';
import { InstitutionHeroVariant } from './institutionHeroVariant';
import CourseDetailsMiddleBannerIcon from '@/app/components/course/CourseDetails/CourseDetailsMiddleBanner/CourseDetailsMiddleBannerIcon';
import mapPin from '@/app/images/MapPin.png';
import notebook from '@/app/images/Notebook.png';
import emergingProvidersBadge from '@/app/images/emergingInstitutions/emgerging-badge.png';
import endorsedProvidersBadge from '@/app/images/badgeGeneric.png';

export type HeroInfoItem = {
  icon: StaticImageData;
  value: string;
  label: string;
};

export { InstitutionHeroVariant } from './institutionHeroVariant';

export interface InstitutionHeroProps {
  variant: InstitutionHeroVariant;
  title: string;
  heroInfoItems: HeroInfoItem[];
}

export default function InstitutionHero({ variant, title, heroInfoItems }: InstitutionHeroProps) {
  const iconByLabel: Record<string, StaticImageData> = {
    Location: mapPin,
    Type: notebook,
  };

  const locationItem = heroInfoItems.find((item) => item.label === 'Location');
  const typeItem = heroInfoItems.find((item) => item.label === 'Type');

  const bannerClass = classNames(
    styles.providerHeroBanner,
    variant === InstitutionHeroVariant.Endorsed && styles.providerHeroBannerEndorsed,
  );

  const heroTextColor = TypographyColorToken.GhostWhite;

  return (
    <section className={styles.providerHeroSection}>
      <div className={bannerClass}>
        <div className={styles.providerHeroCoverContent}>
          <div className={styles.providerHeroCoverInner}>
            <div className={styles.providerHeroInstitutionCol}>
              <Typography
                variant={TypographyVariant.H1}
                color={heroTextColor}
                className={styles.providerHeroInstitutionName}
              >
                ({title})
              </Typography>
            </div>
            <div className={styles.providerHeroTaglineCol}>
              {variant === InstitutionHeroVariant.Emerging ? (
                <Typography
                  variant={TypographyVariant.H3}
                  color={heroTextColor}
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
              ) : (
                <Typography
                  variant={TypographyVariant.H3}
                  color={heroTextColor}
                  className={styles.providerHeroTagline}
                >
                  NDA Endorsed
                  <br />
                  Provider
                  <br />
                  Neuro-inclusive
                  <br />
                  Education &amp; Practice
                </Typography>
              )}
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
            {variant === InstitutionHeroVariant.Emerging ? (
              <Image
                src={emergingProvidersBadge}
                alt='Emerging Providers'
                width={emergingProvidersBadge.width}
                height={emergingProvidersBadge.height}
                className={styles.providerHeroCenterLogoImg}
                priority
              />
            ) : (
              <Image
                src={endorsedProvidersBadge}
                alt='Endorsed Learning Organisation'
                width={192}
                height={192}
                className={styles.providerHeroEndorsedCenterLogoImg}
                priority
              />
            )}
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
