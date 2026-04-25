import Image from 'next/image';
import type { ReactNode } from 'react';
import EmergingInstitutionCtaButton from '../emergingInstitutions/EmergingInstitutionCtaButton';
import styles from './institutionProviderCard.module.css';
import classNames from 'classnames';

export type InstitutionProviderHeader =
  | { kind: 'emergingDefault' }
  | { kind: 'yellow' }
  | { kind: 'remoteImage'; src: string };

export interface InstitutionProviderCardProps {
  pdfUrl: string;
  center: ReactNode;
  header: InstitutionProviderHeader;
  badge?: ReactNode;
  gaEventName?: string;
  gaCategory?: string;
  /** When true, card flexes with siblings to share row width equally (e.g. endorsed row). */
  equalWidth?: boolean;
  /** Stronger shadow + light rim for cards on dark backgrounds (e.g. cherryPie section). */
  elevatedOnDark?: boolean;
  /** GA `file_name` (e.g. set from endorsed row for `endorsed_cta_click`). */
  gaFileName?: string;
  gaEventParams?: Record<string, string | number | boolean | null | undefined>;
}

export default function InstitutionProviderCard({
  pdfUrl,
  center,
  header,
  badge,
  gaEventName,
  gaCategory,
  equalWidth,
  elevatedOnDark,
  gaFileName,
  gaEventParams,
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
            sizes={
              equalWidth
                ? '(max-width: 768px) 100vw, 32vw'
                : '(max-width: 274px) 100vw, 274px'
            }
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
          gaEventName={gaEventName}
          gaCategory={gaCategory}
          gaFileName={gaFileName}
          gaEventParams={gaEventParams}
        />
      </div>
    </div>
  );
}
