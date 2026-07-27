'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';
import EmergingInstitutionCtaButton, {
  DEFAULT_INSTITUTION_CTA_LABEL,
  trackInstitutionCtaClick,
  type InstitutionCtaAnalytics,
} from '../emergingInstitutions/EmergingInstitutionCtaButton';
import styles from './institutionProviderCard.module.css';
import classNames from 'classnames';
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
  /** Denser card for 2-up mobile directory grids. */
  compact?: boolean;
}

function resolveEmergingStateTint(header: InstitutionProviderHeader): AustralianState | undefined {
  if (header.kind !== INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT) {
    return undefined;
  }
  return header.stateTint;
}

function getCardTopClassName(
  header: InstitutionProviderHeader,
  emergingStateTint: AustralianState | undefined,
): string {
  return classNames(
    styles.cardTop,
    header.kind === INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT && styles.cardTopEmerging,
    emergingStateTint && styles.cardTopEmergingWithStateTint,
    emergingStateTint && EMERGING_STATE_TINT_CLASS[emergingStateTint],
    header.kind === INSTITUTION_PROVIDER_HEADER_KIND.YELLOW && styles.cardTopYellow,
    header.kind === INSTITUTION_PROVIDER_HEADER_KIND.CHERRY_PIE_SUB && styles.cardTopCherryPieSub,
    header.kind === INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE && styles.cardTopWithRemoteImage,
  );
}

function renderCardTopMedia(header: InstitutionProviderHeader): ReactNode {
  if (header.kind === INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT) {
    return (
      <Image
        src={emergingCardHeader}
        alt=''
        fill
        sizes='(max-width: 768px) 100vw, 320px'
        className={styles.cardTopImageEmerging}
        loading='lazy'
      />
    );
  }

  if (header.kind === INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE) {
    return (
      <Image
        src={header.src}
        alt=''
        width={1536}
        height={1024}
        sizes='(max-width: 768px) 100vw, 320px'
        className={styles.cardTopImage}
        loading='lazy'
      />
    );
  }

  return null;
}

interface CardBodyActionParams {
  ctaHref?: string;
  comingSoonLabel?: string;
  gaEvent?: InstitutionCtaAnalytics;
  ctaOpenInNewTab?: boolean;
}

function renderCardBodyAction({
  ctaHref,
  comingSoonLabel,
  gaEvent,
  ctaOpenInNewTab,
}: CardBodyActionParams): ReactNode {
  if (ctaHref) {
    return (
      <EmergingInstitutionCtaButton
        ctaHref={ctaHref}
        className={styles.ctaButton}
        analytics={gaEvent}
        openInNewTab={ctaOpenInNewTab}
        decorative
      />
    );
  }

  if (comingSoonLabel) {
    return <span className={styles.comingSoon}>{comingSoonLabel}</span>;
  }

  return null;
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
  compact = false,
}: InstitutionProviderCardProps) {
  const emergingStateTint = resolveEmergingStateTint(header);
  const isClickable = Boolean(ctaHref);

  const handleCardNavigate = () => {
    if (!ctaHref) {
      return;
    }
    trackInstitutionCtaClick({
      ctaHref,
      analytics: gaEvent,
      label: DEFAULT_INSTITUTION_CTA_LABEL,
    });
  };

  const bodyAction = renderCardBodyAction({
    ctaHref,
    comingSoonLabel,
    gaEvent,
    ctaOpenInNewTab,
  });

  return (
    <div
      className={classNames(
        styles.card,
        isClickable && styles.cardClickable,
        equalWidth && styles.cardEqual,
        elevatedOnDark && styles.cardElevatedOnDark,
        ndaCertified && styles.cardNdaCertified,
        compact && styles.cardCompact,
      )}
    >
      {ctaHref ? (
        <Link
          key='stretch-link'
          href={ctaHref}
          className={styles.cardStretchLink}
          aria-label={DEFAULT_INSTITUTION_CTA_LABEL}
          target={ctaOpenInNewTab ? '_blank' : undefined}
          rel={ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
          onClick={handleCardNavigate}
        />
      ) : null}
      <div
        key='card-top'
        className={getCardTopClassName(header, emergingStateTint)}
        data-state-tint={emergingStateTint}
      >
        <Fragment key='card-top-media'>{renderCardTopMedia(header)}</Fragment>
        {badge ? (
          <div
            key='card-top-badge'
            className={classNames(styles.badgeSlot, ndaCertified && styles.badgeSlotCertified)}
          >
            {badge}
          </div>
        ) : null}
      </div>
      <div key='card-body' className={styles.cardBody}>
        <Fragment key='card-center'>{center}</Fragment>
        {bodyAction ? <Fragment key='card-action'>{bodyAction}</Fragment> : null}
      </div>
    </div>
  );
}
