import React from 'react';
import classNames from 'classnames';
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

const DEFAULT_TITLE = 'We endorse Neuro-inclusion in tertiary education';
const DEFAULT_SUBTITLE =
  'Reach out to learn more about our endorsements and the \
              impact we are creating for Neurodivergent students.';

function BannerCopy({
  title,
  subtitle,
  showButton,
}: {
  title?: string;
  subtitle?: string;
  showButton?: boolean;
}) {
  return (
    <div className={styles.textContainer}>
      <Typography variant={TypographyVariant.H1} className='m-0' color='var(--GhostWhite)'>
        {title || DEFAULT_TITLE}
      </Typography>
      <Typography variant={TypographyVariant.H2} color='var(--GhostWhite)'>
        {subtitle || DEFAULT_SUBTITLE}
      </Typography>
      {showButton ? (
        <div className={styles.buttonContainer}>
          <ActionButton
            type='button'
            label='Learn More'
            style={BUTTON_STYLE.Tertiary}
            to='/endorsements'
          />
        </div>
      ) : null}
    </div>
  );
}

function shouldShowSearch(showSearchBar: boolean, displayFilter?: boolean): boolean {
  if (!showSearchBar) {
    return false;
  }
  return Boolean(displayFilter);
}

function BannerSearch({
  interestAreaOptions,
  locationOptions,
  searchDemo,
}: {
  interestAreaOptions: { label: string; value: string }[];
  locationOptions: { label: string; value: string }[];
  searchDemo: boolean;
}) {
  return (
    <ProviderStudySearch
      className={styles.form}
      compact
      surface='homepage'
      interestAreaOptions={interestAreaOptions}
      locationOptions={locationOptions}
      searchDemo={searchDemo}
    />
  );
}

function BannerFrame({ showSearch, children }: { showSearch: boolean; children: React.ReactNode }) {
  return (
    <div className={showSearch ? styles.bannerWithSearch : undefined}>
      <div
        className={classNames(
          'home-hero-banner',
          styles.bannerContainer,
          showSearch ? styles.bannerContainerWithSearch : undefined,
        )}
      >
        {children}
      </div>
    </div>
  );
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
  const showSearch = shouldShowSearch(showSearchBar, displayFilter);

  return (
    <BannerFrame showSearch={showSearch}>
      <div className={styles.bannerOverlay} aria-hidden='true' />
      <div className={styles.bannerTextAndBadge}>
        <BannerCopy title={title} subtitle={subtitle} showButton={showButton} />
        {displayBadges ? <BadgeDisplay /> : null}
      </div>
      {showSearch ? (
        <BannerSearch
          interestAreaOptions={interestAreaOptions}
          locationOptions={locationOptions}
          searchDemo={searchDemo}
        />
      ) : null}
    </BannerFrame>
  );
}
