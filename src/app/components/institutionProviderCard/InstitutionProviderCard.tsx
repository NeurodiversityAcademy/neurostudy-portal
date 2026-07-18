import Image from 'next/image';
import type { ReactNode } from 'react';
import EmergingInstitutionCtaButton from '../emergingInstitutions/EmergingInstitutionCtaButton';
import styles from './institutionProviderCard.module.css';
import classNames from 'classnames';
import type { InstitutionCtaAnalytics } from '../emergingInstitutions/EmergingInstitutionCtaButton';
import emergingCardHeader from '@/app/images/emergingCardHeader.webp';

export const INSTITUTION_PROVIDER_HEADER_KIND = {
  EMERGING_DEFAULT: 'emergingDefault',
  YELLOW: 'yellow',
  CHERRY_PIE_SUB: 'cherryPieSub',
  REMOTE_IMAGE: 'remoteImage',
} as const;

export type InstitutionProviderHeader =
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT }
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.YELLOW }
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.CHERRY_PIE_SUB }
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE; src: string };

export interface InstitutionProviderCardProps {
  ctaHref: string;
  center: ReactNode;
  header: InstitutionProviderHeader;
  badge?: ReactNode;
  /** When true, card flexes with siblings to share row width equally (e.g. endorsed row). */
  equalWidth?: boolean;
  /** Stronger shadow + light rim for cards on dark backgrounds (e.g. cherryPie section). */
  elevatedOnDark?: boolean;
  /** Gold rim for providers that completed NDA training. */
  ndaCertified?: boolean;
  gaEvent?: InstitutionCtaAnalytics;
  ctaOpenInNewTab?: boolean;
}

export default function InstitutionProviderCard({
  ctaHref,
  center,
  header,
  badge,
  equalWidth,
  elevatedOnDark,
  ndaCertified,
  gaEvent,
  ctaOpenInNewTab,
}: InstitutionProviderCardProps) {
  const isEmergingDefault = header.kind === INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT;
  const showRemoteImage = header.kind === INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE;

  const topClass = classNames(
    styles.cardTop,
    isEmergingDefault && styles.cardTopEmerging,
    header.kind === INSTITUTION_PROVIDER_HEADER_KIND.YELLOW && styles.cardTopYellow,
    header.kind === INSTITUTION_PROVIDER_HEADER_KIND.CHERRY_PIE_SUB && styles.cardTopCherryPieSub,
    showRemoteImage && styles.cardTopWithRemoteImage,
  );

  return (
    <div
      className={classNames(
        styles.card,
        equalWidth && styles.cardEqual,
        elevatedOnDark && styles.cardElevatedOnDark,
        ndaCertified && styles.cardNdaCertified,
      )}
    >
      <div className={topClass}>
        {isEmergingDefault ? (
          <Image
            src={emergingCardHeader}
            alt=''
            fill
            sizes='(max-width: 768px) 100vw, 320px'
            className={styles.cardTopImageEmerging}
            loading='lazy'
          />
        ) : null}
        {showRemoteImage ? (
          <Image
            src={header.src}
            alt=''
            width={1536}
            height={1024}
            sizes='(max-width: 768px) 100vw, 320px'
            className={styles.cardTopImage}
            loading='lazy'
          />
        ) : null}
        {badge ? (
          <div className={classNames(styles.badgeSlot, ndaCertified && styles.badgeSlotCertified)}>
            {badge}
          </div>
        ) : null}
      </div>
      <div className={styles.cardBody}>
        {center}
        <EmergingInstitutionCtaButton
          ctaHref={ctaHref}
          className={styles.ctaButton}
          analytics={gaEvent}
          openInNewTab={ctaOpenInNewTab}
        />
      </div>
    </div>
  );
}
