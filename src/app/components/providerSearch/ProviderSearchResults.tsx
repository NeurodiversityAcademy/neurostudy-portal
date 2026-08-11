'use client';

import Image from 'next/image';
import classNames from 'classnames';
import InstitutionProviderCard from '@/app/components/institutionProviderCard/InstitutionProviderCard';
import { INSTITUTION_PROVIDER_HEADER_KIND } from '@/app/components/institutionProviderCard/institutionProviderHeader';
import cardStyles from '@/app/components/institutionProviderCard/institutionProviderCard.module.css';
import EmergingInstitutionCard from '@/app/components/emergingInstitutions/EmergingInstitutionCard';
import { resolveEmergingProviderHref } from '@/app/components/emergingInstitutions/resolveEmergingProviderHref';
import EndorsedCertifiedBadge from '@/app/components/endorsedProviders/EndorsedCertifiedBadge';
import Typography, { TypographyVariant } from '@/app/components/typography/Typography';
import { TypographyColorToken } from '@/app/components/typography/typographyColorToken';
import {
  buildEndorsedProviderDetailHref,
  resolveEndorsedProviderLogoSrc,
} from '@/app/utilities/endorsedProvidersDemo';
import {
  ENDORSED_FALLBACK_LOGO_SRC,
  getEndorsedLogoDimensions,
} from '@/app/utilities/endorsedProviderLogo';
import { ENDORSED_PROVIDER_LOGO_BY_SLUG } from '@/app/components/endorsedProviders/endorsedProviderBrandAssets';
import {
  PROVIDER_SEARCH_TIER_HEADING,
  PROVIDER_SEARCH_TIER_META,
  type ProviderSearchFilters,
  type ProviderSearchRecord,
  type ProviderSearchTier,
  type ProviderSearchTierResults,
} from '@/app/utilities/providerSearch/constants';
import { buildEndorsedCoursesHref } from '@/app/utilities/providerSearch/buildSearchHref';
import { buildProviderSearchResultClickAnalytics } from '@/app/utilities/providerSearch/providerSearchGa';
import {
  countProviderSearchResults,
  listProviderSearchTierGroups,
  type PositionedProviderSearchResult,
} from '@/app/utilities/providerSearch/searchProviders';
import type { AustralianState } from '@/app/components/emergingInstitutions/emergingInstitutionTypes';
import styles from './providerSearchResults.module.css';

type ProviderSearchResultsProps = {
  results: ProviderSearchTierResults;
  filters: ProviderSearchFilters;
  searchDemo: boolean;
};

function resolveEndorsedHref(
  provider: ProviderSearchRecord,
  tier: ProviderSearchTier,
  searchDemo: boolean,
): string {
  if (tier === 'course_endorsed') {
    return buildEndorsedCoursesHref(provider.slug, { searchDemo });
  }
  return buildEndorsedProviderDetailHref(provider.slug, '');
}

function resultClickAnalytics(
  item: PositionedProviderSearchResult,
  filters: ProviderSearchFilters,
  destinationUrl: string,
) {
  return buildProviderSearchResultClickAnalytics({
    providerSlug: item.provider.slug,
    providerTier: item.tier,
    resultPosition: item.position,
    interestAreas: filters.interestAreas,
    locations: filters.locations,
    destinationUrl,
  });
}

function renderEndorsedCard(
  item: PositionedProviderSearchResult,
  searchDemo: boolean,
  filters: ProviderSearchFilters,
) {
  const { provider, tier } = item;
  const href = resolveEndorsedHref(provider, tier, searchDemo);
  const logoSrc = resolveEndorsedProviderLogoSrc(
    provider.slug,
    provider.logoSrc || ENDORSED_FALLBACK_LOGO_SRC,
    ENDORSED_PROVIDER_LOGO_BY_SLUG,
  );
  const logoDimensions = getEndorsedLogoDimensions(logoSrc);

  return (
    <InstitutionProviderCard
      key={`${tier}-${provider.slug}`}
      ndaCertified={provider.ndaCertified}
      ctaHref={href}
      compact
      header={
        provider.topBackgroundImage
          ? {
              kind: INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE,
              src: provider.topBackgroundImage,
            }
          : { kind: INSTITUTION_PROVIDER_HEADER_KIND.YELLOW }
      }
      badge={<EndorsedCertifiedBadge size='card' certified={provider.ndaCertified} />}
      center={
        <div className={cardStyles.logoWrap}>
          <Image
            src={logoSrc}
            alt={`${provider.name} logo`}
            width={logoDimensions.width}
            height={logoDimensions.height}
          />
        </div>
      }
      gaEvent={resultClickAnalytics(item, filters, href)}
    />
  );
}

function renderEmergingCard(item: PositionedProviderSearchResult, filters: ProviderSearchFilters) {
  const { provider } = item;
  const state = (provider.emergingState ?? 'NSW') as AustralianState;
  const destinationUrl = resolveEmergingProviderHref({ name: provider.name });

  return (
    <EmergingInstitutionCard
      key={`${item.tier}-${provider.slug}`}
      name={provider.name}
      state={state}
      ctaOpenInNewTab={false}
      gaEvent={destinationUrl ? resultClickAnalytics(item, filters, destinationUrl) : undefined}
    />
  );
}

function renderProviderCard(
  item: PositionedProviderSearchResult,
  searchDemo: boolean,
  filters: ProviderSearchFilters,
) {
  if (item.provider.kind === 'emerging') {
    return renderEmergingCard(item, filters);
  }
  return renderEndorsedCard(item, searchDemo, filters);
}

function TierSectionHeader({ tier }: { tier: ProviderSearchTier }) {
  const meta = PROVIDER_SEARCH_TIER_META[tier];
  const isProminent = meta.emphasis === 'endorsed';
  const eyebrowColor = isProminent
    ? TypographyColorToken.CherryPie
    : TypographyColorToken.BondBlackVariant;
  const titleVariant = isProminent ? TypographyVariant.H2 : TypographyVariant.H3;

  return (
    <header className={styles.tierHeader}>
      <Typography
        variant={TypographyVariant.Body3Strong}
        color={eyebrowColor}
        className={styles.tierEyebrow}
      >
        {meta.eyebrow}
      </Typography>
      <Typography
        id={`provider-search-tier-${tier}`}
        variant={titleVariant}
        className={classNames(
          styles.tierHeading,
          isProminent ? styles.tierHeadingProminent : styles.tierHeadingQuiet,
        )}
      >
        {PROVIDER_SEARCH_TIER_HEADING[tier]}
      </Typography>
      <div
        className={classNames(styles.tierRule, isProminent ? undefined : styles.tierRuleQuiet)}
        aria-hidden='true'
      />
      <Typography
        variant={TypographyVariant.Body2}
        color={TypographyColorToken.BondBlackVariant}
        className={styles.tierSubtitle}
      >
        {meta.subtitle}
      </Typography>
    </header>
  );
}

export default function ProviderSearchResults({
  results,
  filters,
  searchDemo,
}: ProviderSearchResultsProps) {
  const totalCount = countProviderSearchResults(results);
  const tierGroups = listProviderSearchTierGroups(results);

  return (
    <div className={styles.root}>
      {totalCount === 0 ? (
        <div className={styles.emptyState} role='status'>
          <Typography variant={TypographyVariant.H2} color={TypographyColorToken.BondBlack}>
            No providers matched your search
          </Typography>
          <Typography variant={TypographyVariant.Body1} color={TypographyColorToken.BondBlack}>
            Try a different area of study or location.
          </Typography>
        </div>
      ) : (
        tierGroups.map(({ tier, items }) => {
          const isProminent = PROVIDER_SEARCH_TIER_META[tier].emphasis === 'endorsed';
          return (
            <section
              key={tier}
              className={classNames(
                styles.tierSection,
                isProminent ? styles.tierSectionProminent : styles.tierSectionQuiet,
              )}
              aria-labelledby={`provider-search-tier-${tier}`}
            >
              <div className={styles.tierInner}>
                <TierSectionHeader tier={tier} />
                <div className={styles.cardGrid}>
                  {items.map((item) => renderProviderCard(item, searchDemo, filters))}
                </div>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
