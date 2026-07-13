'use client';

import Image, { type StaticImageData } from 'next/image';
import classNames from 'classnames';
import Typography, { TypographyVariant } from '../typography/Typography';
import { TypographyColorToken } from '../typography/typographyColorToken';
import mapPin from '@/app/images/MapPin.png';
import notebook from '@/app/images/Notebook.png';
import EndorsedCertifiedBadge from './EndorsedCertifiedBadge';
import { sendEndorsedExploreClickEvent } from '@/app/utilities/gaTracking';
import styles from './endorsedInstitutionCoverHero.module.css';

export interface EndorsedInstitutionCoverHeroProps {
  locationValue?: string;
  studyModeValue?: string;
  typeValue?: string;
  /** Large institution mark beside the endorsed badge (from endorsed provider data). */
  institutionIconSrc?: string | StaticImageData;
  /** External courses URL for the Explore CTA (from endorsed provider data). */
  coursesUrl?: string;
  /** Optional hero cover photo from endorsed provider data. */
  coverImageSrc?: string;
  /** Slug used as GA provider identifier. */
  providerSlug: string;
  /** Gold star on badge + rim when provider completed NDA training. */
  ndaCertified?: boolean;
}

interface MetaStripFieldProps {
  src: StaticImageData;
  title: string;
  description: string;
  secondaryDescription?: string;
}

function MetaStripField({
  src,
  title,
  description,
  secondaryDescription,
}: MetaStripFieldProps) {
  return (
    <div className={styles.metaField}>
      <div className={styles.metaFieldIconWrap}>
        <Image src={src} alt='' className={styles.metaFieldIcon} />
      </div>
      <div className={styles.metaFieldText}>
        <Typography
          variant={TypographyVariant.Body2Strong}
          color={TypographyColorToken.BondBlack}
          className={styles.metaFieldLabel}
        >
          {title}
        </Typography>
        <Typography
          variant={TypographyVariant.Body3}
          color={TypographyColorToken.BondBlack}
          className={styles.metaFieldValue}
        >
          {description}
        </Typography>
        {secondaryDescription ? (
          <Typography
            variant={TypographyVariant.Body3}
            color={TypographyColorToken.BondBlack}
            className={styles.metaFieldValue}
          >
            {secondaryDescription}
          </Typography>
        ) : null}
      </div>
    </div>
  );
}

export default function EndorsedInstitutionCoverHero({
  locationValue,
  studyModeValue,
  typeValue,
  institutionIconSrc,
  coursesUrl,
  coverImageSrc,
  providerSlug,
  ndaCertified = false,
}: EndorsedInstitutionCoverHeroProps) {
  const iconByLabel = {
    Type: notebook,
    Location: mapPin,
  };
  const hasCoverImage = coverImageSrc !== undefined && coverImageSrc.length > 0;
  const titleColor = hasCoverImage
    ? TypographyColorToken.GhostWhite
    : TypographyColorToken.BondBlack;

  const handleExploreClick = () => {
    if (coursesUrl === undefined || coursesUrl.length === 0) {
      return;
    }
    sendEndorsedExploreClickEvent(providerSlug, coursesUrl);
  };

  return (
    <section className={styles.section} aria-label='Endorsed provider cover'>
      <div
        className={classNames(
          styles.banner,
          hasCoverImage && styles.bannerWithCover
        )}
        style={
          hasCoverImage
            ? { backgroundImage: `url(${coverImageSrc})` }
            : undefined
        }
      >
        <div className={styles.bannerContent}>
          <div className={styles.textContainer}>
            <Typography
              variant={TypographyVariant.H1}
              color={titleColor}
              className={classNames(
                styles.title,
                hasCoverImage && styles.titleOnCover
              )}
            >
              Neurodiversity Academy Endorsed Provider
            </Typography>
          </div>
        </div>

        {coursesUrl ? (
          <div className={styles.ctaCard}>
            <Typography
              variant={TypographyVariant.Body2}
              color={TypographyColorToken.BondBlack}
              className={styles.ctaTitle}
            >
              Explore this organisation&apos;s courses
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
                href={coursesUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.ctaExploreLink}
                onClick={handleExploreClick}
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
        ) : null}
      </div>
      <div className={styles.metaStripWrap}>
        <div
          className={classNames(
            styles.metaStrip,
            ndaCertified && styles.metaStripNdaCertified
          )}
        >
          <div className={styles.metaSlot}>
            {typeValue ? (
              <MetaStripField
                src={iconByLabel.Type}
                title='Type'
                description={typeValue}
              />
            ) : null}
          </div>

          <div className={styles.metaBadgeCenter}>
            <div className={styles.metaEndorsedBadgeWrap}>
              <EndorsedCertifiedBadge size='meta' certified={ndaCertified} />
            </div>
            {institutionIconSrc ? (
              <div className={styles.metaInstitutionIconWrap}>
                <Image
                  src={institutionIconSrc}
                  alt=''
                  fill
                  className={styles.metaInstitutionIcon}
                  sizes='(max-width: 767px) 108px, 200px'
                  unoptimized
                />
              </div>
            ) : null}
          </div>

          <div className={styles.metaSlot}>
            {locationValue || studyModeValue ? (
              <MetaStripField
                src={iconByLabel.Location}
                title='Location'
                description={locationValue ?? studyModeValue ?? ''}
                secondaryDescription={
                  locationValue && studyModeValue ? studyModeValue : undefined
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
