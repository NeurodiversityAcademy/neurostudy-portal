import Image from 'next/image';
import type { ReactNode } from 'react';
import EmergingInstitutionCtaButton from '../emergingInstitutions/EmergingInstitutionCtaButton';
import styles from './institutionProviderCard.module.css';
import classNames from 'classnames';
import type { InstitutionCtaAnalytics } from '../emergingInstitutions/EmergingInstitutionCtaButton';

export const INSTITUTION_PROVIDER_HEADER_KIND = {
  EMERGING_DEFAULT: 'emergingDefault',
  YELLOW: 'yellow',
  REMOTE_IMAGE: 'remoteImage',
} as const;

export type InstitutionProviderHeader =
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT }
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.YELLOW }
  | { kind: typeof INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE; src: string };

export interface InstitutionProviderCardProps {
  pdfUrl: string;
  center: ReactNode;
  header: InstitutionProviderHeader;
  badge?: ReactNode;
  /** When true, card flexes with siblings to share row width equally (e.g. endorsed row). */
  equalWidth?: boolean;
  /** Stronger shadow + light rim for cards on dark backgrounds (e.g. cherryPie section). */
  elevatedOnDark?: boolean;
  gaEvent?: InstitutionCtaAnalytics;
  ctaOpenInNewTab?: boolean;
}

export default function InstitutionProviderCard({
  pdfUrl,
  center,
  header,
  badge,
  equalWidth,
  elevatedOnDark,
  gaEvent,
  ctaOpenInNewTab,
}: InstitutionProviderCardProps) {
  const topClass = classNames(
    styles.cardTop,
    header.kind === INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT &&
      styles.cardTopEmerging,
    header.kind === INSTITUTION_PROVIDER_HEADER_KIND.YELLOW &&
      styles.cardTopYellow
  );

  const showRemoteImage =
    header.kind === INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE;

  return (
    <div
      className={classNames(
        styles.card,
        equalWidth && styles.cardEqual,
        elevatedOnDark && styles.cardElevatedOnDark
      )}
    >
      <div className={topClass}>
        {showRemoteImage ? (
          <Image
            src={header.src}
            alt=''
            fill
            className={styles.cardTopImage}
            priority={false}
          />
        ) : null}
        {badge ? <div className={styles.badgeSlot}>{badge}</div> : null}
      </div>
      <div className={styles.cardBody}>
        {center}
        <EmergingInstitutionCtaButton
          pdfUrl={pdfUrl}
          className={styles.ctaButton}
          analytics={gaEvent}
          openInNewTab={ctaOpenInNewTab}
        />
      </div>
    </div>
  );
}
