import Image from 'next/image';
import type { ReactNode } from 'react';
import EmergingInstitutionCtaButton from '../emergingInstitutions/EmergingInstitutionCtaButton';
import styles from './institutionProviderCard.module.css';
import classNames from 'classnames';
import type { InstitutionCtaAnalytics } from '../emergingInstitutions/EmergingInstitutionCtaButton';
import emergingCardHeader from '@/app/images/emergingCardHeader.webp';
import type { AustralianState } from '../emergingInstitutions/emergingInstitutionTypes';

export const INSTITUTION_PROVIDER_HEADER_KIND = {
  EMERGING_DEFAULT: 'emergingDefault',
  YELLOW: 'yellow',
  CHERRY_PIE_SUB: 'cherryPieSub',
  REMOTE_IMAGE: 'remoteImage',
} as const;

export type InstitutionProviderHeader =
  | {
      kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT;
      /** Soft header tint so dense grids scan by state. */
      stateTint?: AustralianState;
    }
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.YELLOW }
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.CHERRY_PIE_SUB }
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE; src: string };

const EMERGING_STATE_TINT_CLASS: Record<AustralianState, string> = {
  NSW: styles.cardTopEmergingNSW,
  VIC: styles.cardTopEmergingVIC,
  QLD: styles.cardTopEmergingQLD,
  SA: styles.cardTopEmergingSA,
  WA: styles.cardTopEmergingWA,
  TAS: styles.cardTopEmergingTAS,
  NT: styles.cardTopEmergingNT,
  ACT: styles.cardTopEmergingACT,
};

export interface InstitutionProviderCardProps {
  /** When omitted, the Explore More CTA is hidden (e.g. demo listings). */
  ctaHref?: string;
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
  /** Shown instead of the CTA when there is no detail page yet. */
  comingSoonLabel?: string;
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
  comingSoonLabel,
}: InstitutionProviderCardProps) {
  const isEmergingDefault = header.kind === INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT;
  const emergingStateTint =
    isEmergingDefault && header.stateTint ? header.stateTint : undefined;
  const showRemoteImage = header.kind === INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE;

  const topClass = classNames(
    styles.cardTop,
    isEmergingDefault && styles.cardTopEmerging,
    emergingStateTint && styles.cardTopEmergingWithStateTint,
    emergingStateTint && EMERGING_STATE_TINT_CLASS[emergingStateTint],
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
      <div className={topClass} data-state-tint={emergingStateTint}>
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
        {ctaHref ? (
          <EmergingInstitutionCtaButton
            ctaHref={ctaHref}
            className={styles.ctaButton}
            analytics={gaEvent}
            openInNewTab={ctaOpenInNewTab}
          />
        ) : comingSoonLabel ? (
          <span className={styles.comingSoon}>{comingSoonLabel}</span>
        ) : null}
      </div>
    </div>
  );
}
