import Image from 'next/image';
import classNames from 'classnames';
import badgeGeneric from '@/app/images/badgeGeneric.png';
import { ENDORSED_PROVIDERS_BADGE_ALT } from '@/app/utilities/endorsedProvidersDemo';
import styles from './endorsedCertifiedBadge.module.css';

type BadgeSize = 'card' | 'meta';

const BADGE_SIZE = {
  card: 48,
  meta: 56,
} as const;

export default function EndorsedCertifiedBadge({
  size,
  certified = false,
}: {
  size: BadgeSize;
  certified?: boolean;
}) {
  const px = BADGE_SIZE[size];

  return (
    <div className={classNames(styles.wrap, styles[size])}>
      {certified ? (
        <span className={styles.star} aria-hidden='true'>
          ★
        </span>
      ) : null}
      <Image
        src={badgeGeneric}
        alt={ENDORSED_PROVIDERS_BADGE_ALT}
        width={px}
        height={px}
        className={styles.badgeImage}
      />
    </div>
  );
}
