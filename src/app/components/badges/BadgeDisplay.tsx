import React from 'react';
import Image from 'next/image';
import styles from './badgeDisplay.module.css';
import goldBadge from '../../images/goldBadge.jpg';
import silverBadge from '../../images/silverBadge.jpg';
import bronzeBadge from '../../images/bronzeBadge.jpg';

export default function BadgeDisplay() {
  return (
    <div className={styles.badgeWrapper}>
      <div className={styles.badgegroup1}>
        <Image src={goldBadge} alt='Gold Badge' />
      </div>
      <div className={styles.badgegroup2}>
        <Image src={silverBadge} alt='SilverBadge' />
        <Image src={bronzeBadge} alt='Bronze Badge' />
      </div>
    </div>
  );
}
