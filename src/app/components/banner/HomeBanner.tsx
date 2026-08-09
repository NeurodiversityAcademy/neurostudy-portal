import React from 'react';
import styles from './banner.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import BadgeDisplay from '../badges/BadgeDisplay';
import ProviderStudySearch from '../providerSearch/ProviderStudySearch';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import ActionButton from '../buttons/ActionButton';

interface PropType {
  displayBadges?: boolean;
  showButton?: boolean;
  displayFilter?: boolean;
  title?: string;
  subtitle?: string;
  showSearchBar?: boolean;
  interestAreaOptions?: { label: string; value: string }[];
  locationOptions?: { label: string; value: string }[];
  searchDemo?: boolean;
}

export default function HomeBanner({
  displayBadges,
  displayFilter,
  showButton,
  title,
  subtitle,
  showSearchBar = false,
  interestAreaOptions = [],
  locationOptions = [],
  searchDemo = false,
}: PropType) {
  const showSearch = Boolean(showSearchBar && displayFilter);

  return (
    <div className={showSearch ? styles.bannerWithSearch : undefined}>
      <div
        className={`home-hero-banner ${styles.bannerContainer}${
          showSearch ? ` ${styles.bannerContainerWithSearch}` : ''
        }`}
      >
        <div className={styles.bannerOverlay} aria-hidden='true' />
        <div className={styles.bannerTextAndBadge}>
          <div className={styles.textContainer}>
            <Typography variant={TypographyVariant.H1} className='m-0' color='var(--GhostWhite)'>
              {title || 'We endorse Neuro-inclusion in tertiary education'}
            </Typography>
            <Typography variant={TypographyVariant.H2} color='var(--GhostWhite)'>
              {subtitle ||
                'Reach out to learn more about our endorsements and the \
              impact we are creating for Neurodivergent students.'}
            </Typography>
            {showButton && (
              <div className={styles.buttonContainer}>
                <ActionButton
                  type='button'
                  label='Learn More'
                  style={BUTTON_STYLE.Tertiary}
                  to='/endorsements'
                />
              </div>
            )}
          </div>
          {displayBadges && <BadgeDisplay />}
        </div>
        {showSearch && (
          <ProviderStudySearch
            className={styles.form}
            compact
            surface='homepage'
            interestAreaOptions={interestAreaOptions}
            locationOptions={locationOptions}
            searchDemo={searchDemo}
          />
        )}
      </div>
    </div>
  );
}
