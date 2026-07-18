import React from 'react';
import Image from 'next/image';
import styles from './badgeDisplay.module.css';
import badgeGeneric from '../../images/badgeGeneric.webp';

interface BadgeDisplayProps {
  priority?: boolean;
}

export default function BadgeDisplay({ priority = false }: BadgeDisplayProps) {
  return (
    <div className={styles.badgeWrapper}>
      <Image
        src={badgeGeneric}
        alt='Common Badge'
        width={152}
        height={152}
        sizes='(max-width: 480px) 20vw, 152px'
        priority={priority}
        loading={priority ? undefined : 'lazy'}
      />
    </div>
  );
}
