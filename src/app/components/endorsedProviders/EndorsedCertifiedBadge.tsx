import Image from 'next/image';
import classNames from 'classnames';
import badgeGeneric from '@/app/images/badgeGeneric.png';
import { ENDORSED_PROVIDERS_BADGE_ALT } from '@/app/utilities/endorsedProvidersDemo';
import styles from './endorsedCertifiedBadge.module.css';

export type EndorsedCertifiedBadgeSize = 'card' | 'meta';

export interface EndorsedCertifiedBadgeProps {
  size: EndorsedCertifiedBadgeSize;
  certified?: boolean;
  className?: string;
}

const BADGE_DIMENSIONS = {
  card: { width: 48, height: 48 },
  meta: { width: 56, height: 56 },
} as const;

export default function EndorsedCertifiedBadge({
  size,
  certified = false,
  className,
}: EndorsedCertifiedBadgeProps) {
  const dimensions = BADGE_DIMENSIONS[size];

  return (
    <div
      className={classNames(
        styles.wrap,
        styles[size],
        certified && styles.certified,
        className
      )}
    >
      {certified ? (
        <svg
          className={styles.starIcon}
          viewBox='0 0 24 24'
          aria-hidden='true'
          focusable='false'
        >
          <path
            fill='currentColor'
            d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
          />
        </svg>
      ) : null}
      <Image
        src={badgeGeneric}
        alt={ENDORSED_PROVIDERS_BADGE_ALT}
        width={dimensions.width}
        height={dimensions.height}
        className={styles.badgeImage}
      />
    </div>
  );
}
