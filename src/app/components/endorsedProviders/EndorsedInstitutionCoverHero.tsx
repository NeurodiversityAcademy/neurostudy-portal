import Image from 'next/image';
import Typography, { TypographyVariant } from '../typography/Typography';
import { TypographyColorToken } from '../typography/typographyColorToken';
import CourseDetailsMiddleBannerIcon from '@/app/components/course/CourseDetails/CourseDetailsMiddleBanner/CourseDetailsMiddleBannerIcon';
import mapPin from '@/app/images/MapPin.png';
import notebook from '@/app/images/Notebook.png';
import endorsedProvidersBadge from '@/app/images/badgeGeneric.png';
import styles from './endorsedInstitutionCoverHero.module.css';

export interface EndorsedInstitutionCoverHeroProps {
  backgroundSrc: string;
  locationValue?: string;
  typeValue?: string;
  /** Large institution mark beside the endorsed badge (from endorsed provider data). */
  institutionIconSrc?: string;
}

export default function EndorsedInstitutionCoverHero({
  backgroundSrc,
  locationValue,
  typeValue,
  institutionIconSrc,
}: EndorsedInstitutionCoverHeroProps) {
  const iconByLabel = {
    Type: notebook,
    Location: mapPin,
  };

  return (
    <section className={styles.section} aria-label='Endorsed provider cover'>
      <div className={styles.banner}>
        <Image
          src={backgroundSrc}
          alt=''
          fill
          className={styles.bannerImage}
          sizes='100vw'
          priority
        />
        <div className={styles.bannerOverlay} />

        <div className={styles.bannerContent}>
          <div className={styles.textContainer}>
            <Typography
              variant={TypographyVariant.H1}
              color={TypographyColorToken.PureWhite}
              className={styles.title}
            >
              Neurodiversity Academy Endorsed Provider
            </Typography>
          </div>

          <div className={styles.ctaCard}>
            <Typography
              variant={TypographyVariant.Body2}
              color={TypographyColorToken.BondBlack}
              className={styles.ctaTitle}
            >
              Explore This Organisation&apos;s
              <br />
              Courses
            </Typography>
            <Typography
              variant={TypographyVariant.Body3}
              color={TypographyColorToken.BondBlackVariant}
              className={styles.ctaBody}
            >
              Find the right course to support your learning journey.
            </Typography>
            <div className={styles.ctaExploreRow}>
              <a
                href='https://www.collarts.edu.au/courses'
                target='_blank'
                rel='noopener noreferrer'
                className={styles.ctaExploreLink}
              >
                <Typography
                  variant={TypographyVariant.Body2}
                  color={TypographyColorToken.PureWhite}
                  className={styles.ctaExploreText}
                >
                  Explore
                </Typography>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.metaStripWrap}>
        <div className={styles.metaStrip}>
          <div className={styles.metaSlot}>
            {typeValue ? (
              <CourseDetailsMiddleBannerIcon
                src={iconByLabel.Type}
                alt=''
                title='Type'
                description={typeValue}
              />
            ) : null}
          </div>

          <div className={styles.metaBadgeCenter}>
            <div className={styles.metaEndorsedBadgeWrap}>
              <Image
                src={endorsedProvidersBadge}
                alt='Endorsed Learning Organisation'
                width={220}
                height={220}
                className={styles.metaBadgeImage}
              />
            </div>
            {institutionIconSrc ? (
              <div className={styles.metaInstitutionIconWrap}>
                <Image
                  src={institutionIconSrc}
                  alt=''
                  fill
                  className={styles.metaInstitutionIcon}
                  sizes='(max-width: 767px) 180px, 260px'
                  unoptimized
                />
              </div>
            ) : null}
          </div>

          <div className={styles.metaSlot}>
            {locationValue ? (
              <CourseDetailsMiddleBannerIcon
                src={iconByLabel.Location}
                alt=''
                title='Location'
                description={locationValue}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
