'use client';

import Image, { type StaticImageData } from 'next/image';
import InstitutionProviderCard from '@/app/components/institutionProviderCard/InstitutionProviderCard';
import { INSTITUTION_PROVIDER_HEADER_KIND } from '@/app/components/institutionProviderCard/institutionProviderHeader';
import cardStyles from '@/app/components/institutionProviderCard/institutionProviderCard.module.css';
import EndorsedCertifiedBadge from '@/app/components/endorsedProviders/EndorsedCertifiedBadge';
import Typography, { TypographyVariant } from '@/app/components/typography/Typography';
import { TypographyColorToken } from '@/app/components/typography/typographyColorToken';
import {
  buildEndorsedProviderDetailHref,
  resolveEndorsedProviderLogoSrc,
} from '@/app/utilities/endorsedProvidersDemo';
import { buildEmergingProviderDetailHref } from '@/app/emergingproviders/emergingProviderMetadata';
import { hasEmergingProviderProfile } from '@/app/components/emergingInstitutions/emergingProviderProfileSlugs';
import { ENDORSED_PROVIDER_LOGO_BY_SLUG } from '@/app/components/endorsedProviders/endorsedProviderBrandAssets';
import {
  PROVIDER_SEARCH_GA,
  PROVIDER_SEARCH_TIER_HEADING,
  PROVIDER_SEARCH_TIER_ORDER,
  type ProviderSearchFilters,
  type ProviderSearchRecord,
  type ProviderSearchTier,
  type ProviderSearchTierResults,
} from '@/app/utilities/providerSearch/constants';
import { buildEndorsedCoursesHref } from '@/app/utilities/providerSearch/buildSearchHref';
import { joinGaMultiValue } from '@/app/utilities/providerSearch/normalize';
import type { AustralianState } from '@/app/components/emergingInstitutions/emergingInstitutionTypes';
import styles from './providerSearchResults.module.css';

const FALLBACK_LOGO_WIDTH = 921;
const FALLBACK_LOGO_HEIGHT = 271;

type ProviderSearchResultsProps = {
  results: ProviderSearchTierResults;
  filters: ProviderSearchFilters;
  searchDemo: boolean;
  totalCount: number;
};

function getLogoDimensions(logoSrc: string | StaticImageData): { width: number; height: number } {
  if (typeof logoSrc === 'string') {
    return { width: FALLBACK_LOGO_WIDTH, height: FALLBACK_LOGO_HEIGHT };
  }
  return { width: logoSrc.width, height: logoSrc.height };
}

function resolveHref(
  provider: ProviderSearchRecord,
  tier: ProviderSearchTier,
  searchDemo: boolean,
): string | undefined {
  if (provider.kind === 'endorsed') {
    if (tier === 'course_endorsed') {
      return buildEndorsedCoursesHref(provider.slug, { searchDemo });
    }
    return buildEndorsedProviderDetailHref(provider.slug, '');
  }
  if (!hasEmergingProviderProfile(provider.slug)) {
    return undefined;
  }
  return buildEmergingProviderDetailHref(provider.slug);
}

function renderProviderCard(params: {
  provider: ProviderSearchRecord;
  tier: ProviderSearchTier;
  searchDemo: boolean;
  position: number;
  filters: ProviderSearchFilters;
}) {
  const { provider, tier, searchDemo, position, filters } = params;
  const href = resolveHref(provider, tier, searchDemo);
  const logoSrc =
    provider.kind === 'endorsed'
      ? resolveEndorsedProviderLogoSrc(
          provider.slug,
          provider.logoSrc || '/images/AcademiaLogoLong.png',
          ENDORSED_PROVIDER_LOGO_BY_SLUG,
        )
      : undefined;
  const logoDimensions = logoSrc ? getLogoDimensions(logoSrc) : null;
  const emergingState = provider.emergingState as AustralianState | undefined;

  return (
    <InstitutionProviderCard
      key={`${tier}-${provider.slug}`}
      ndaCertified={provider.ndaCertified}
      ctaHref={href}
      comingSoonLabel={href ? undefined : 'Profile coming soon'}
      header={
        provider.kind === 'emerging'
          ? {
              kind: INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT,
              stateTint: emergingState ?? 'NSW',
            }
          : provider.topBackgroundImage
            ? {
                kind: INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE,
                src: provider.topBackgroundImage,
              }
            : { kind: INSTITUTION_PROVIDER_HEADER_KIND.YELLOW }
      }
      badge={
        provider.kind === 'endorsed' ? (
          <EndorsedCertifiedBadge size='card' certified={provider.ndaCertified} />
        ) : undefined
      }
      center={
        provider.kind === 'endorsed' && logoSrc && logoDimensions ? (
          <div className={cardStyles.logoWrap}>
            <Image
              src={logoSrc}
              alt={`${provider.name} logo`}
              width={logoDimensions.width}
              height={logoDimensions.height}
            />
          </div>
        ) : (
          <Typography
            variant={TypographyVariant.Body2Strong}
            color={TypographyColorToken.BondBlack}
          >
            {provider.name}
          </Typography>
        )
      }
      gaEvent={
        href
          ? {
              eventName: PROVIDER_SEARCH_GA.resultClick.eventName,
              category: PROVIDER_SEARCH_GA.resultClick.category,
              params: {
                provider_slug: provider.slug,
                provider_tier: tier,
                result_position: position,
                interest_areas: joinGaMultiValue(filters.interestAreas),
                locations: joinGaMultiValue(filters.locations),
                destination_url: href,
              },
            }
          : undefined
      }
    />
  );
}

export default function ProviderSearchResults({
  results,
  filters,
  searchDemo,
  totalCount,
}: ProviderSearchResultsProps) {
  let globalPosition = 0;

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
        PROVIDER_SEARCH_TIER_ORDER.map((tier) => {
          const providers = results[tier];
          if (providers.length === 0) {
            return null;
          }

          return (
            <section
              key={tier}
              className={styles.tierSection}
              aria-labelledby={`provider-search-tier-${tier}`}
            >
              <Typography
                id={`provider-search-tier-${tier}`}
                variant={TypographyVariant.H2}
                color={TypographyColorToken.BondBlack}
                className={styles.tierHeading}
              >
                {PROVIDER_SEARCH_TIER_HEADING[tier]}
              </Typography>
              <div className={styles.cardGrid}>
                {providers.map((provider) => {
                  globalPosition += 1;
                  return renderProviderCard({
                    provider,
                    tier,
                    searchDemo,
                    position: globalPosition,
                    filters,
                  });
                })}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
