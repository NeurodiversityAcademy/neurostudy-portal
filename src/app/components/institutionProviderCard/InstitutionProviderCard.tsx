import Image from 'next/image';
import type { ReactNode } from 'react';
import EmergingInstitutionCtaButton from '../emergingInstitutions/EmergingInstitutionCtaButton';
import styles from './institutionProviderCard.module.css';
import classNames from 'classnames';
import type { InstitutionCtaAnalytics } from '../emergingInstitutions/EmergingInstitutionCtaButton';

export type InstitutionProviderHeader =
  | { kind: 'emergingDefault' }
  | { kind: 'yellow' }
  | { kind: 'remoteImage'; src: string };

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
}

export default function InstitutionProviderCard({
  pdfUrl,
  center,
  header,
  badge,
  equalWidth,
  elevatedOnDark,
  gaEvent,
}: InstitutionProviderCardProps) {
  const topClass = classNames(
    styles.cardTop,
    header.kind === 'emergingDefault' && styles.cardTopEmerging,
    header.kind === 'yellow' && styles.cardTopYellow
  );

  const showRemoteImage = header.kind === 'remoteImage';

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
        />
      </div>
    </div>
  );
}
