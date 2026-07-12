import Image from 'next/image';
import classNames from 'classnames';
import InstitutionProviderCard from '../institutionProviderCard/InstitutionProviderCard';
import cardStyles from '../institutionProviderCard/institutionProviderCard.module.css';
import sectionStyles from '../emergingInstitutions/emergingInstitutions.module.css';
import endorseStyles from './endorsedProviders.module.css';
import badgeGeneric from '../../images/badgeGeneric.png';
import Typography, { TypographyVariant } from '../typography/Typography';
import { TypographyColorToken } from '../typography/typographyColorToken';
import { analyticsFileNameFromUrl } from '@/app/utilities/analyticsFileName';
import { slugify } from '@/app/utilities/common';
import {
  ENDORSED_PROVIDERS_BADGE_ALT,
  ENDORSED_PROVIDERS_GA,
  ENDORSED_PROVIDERS_HEADING,
  ENDORSED_PROVIDERS_SECTION_ID,
  ENDORSED_PROVIDERS_SUBTITLE,
  buildEndorsedProviderDetailHref,
  resolveEndorsedProviderLogoSrc,
} from '@/app/utilities/endorsedProvidersDemo';
import { INSTITUTION_PROVIDER_HEADER_KIND } from '../institutionProviderCard/InstitutionProviderCard';
import { ENDORSED_PROVIDER_LOGO_BY_SLUG } from './endorsedProviderBrandAssets';
import EndorsedCertifiedBadge from './EndorsedCertifiedBadge';
import endorsedData from './endorsedProviders.json';
import { providerNameFromId } from './providerName';

type EndorsedProviderRawRow = {
  id: string;
  live?: boolean;
  ndaCertified?: boolean;
  logo: string;
  topBackgroundImage?: string;
  institutionCoursesUrl: string;
};

type EndorsedProviderRow = {
  id: string;
  logo: string;
  topBackgroundImage?: string;
  institutionCoursesUrl: string | null;
};

type EndorsedProvidersProps = {
  demoGuid?: string;
  demoSlug?: string;
};

function toEndorsedProviderRow(
  row: EndorsedProviderRawRow
): EndorsedProviderRow {
  return {
    id: row.id,
    logo: row.logo,
    topBackgroundImage: row.topBackgroundImage,
    institutionCoursesUrl: row.institutionCoursesUrl,
  };
}

function resolveProvidersToShow(
  rawProviders: EndorsedProviderRawRow[],
  demoGuid: string,
  demoSlug: string
): EndorsedProviderRow[] {
  const providers = rawProviders.map(toEndorsedProviderRow);
  const liveProviders = providers.filter((provider) => {
    const row = rawProviders.find((item) => item.id === provider.id);
    return row?.live === true;
  });

  if (demoGuid === '' || demoSlug === '') {
    return liveProviders;
  }

  const demoProvider = providers.find(
    (provider) => slugify(provider.id) === demoSlug
  );
  if (!demoProvider) {
    return liveProviders;
  }

  const demoRow = rawProviders.find((item) => item.id === demoProvider.id);
  if (demoRow?.live === true) {
    return liveProviders;
  }

  const alreadyListed = liveProviders.some(
    (provider) => provider.id === demoProvider.id
  );
  if (alreadyListed) {
    return liveProviders;
  }

  return [...liveProviders, demoProvider];
}

export default function EndorsedProviders({
  demoGuid = '',
  demoSlug = '',
}: EndorsedProvidersProps) {
  const rawProviders = endorsedData as EndorsedProviderRawRow[];
  const providers = resolveProvidersToShow(rawProviders, demoGuid, demoSlug);
  const showCertifiedLegend = providers.some((provider) => {
    const row = rawProviders.find((item) => item.id === provider.id);
    return row?.ndaCertified === true;
  });

  if (providers.length === 0) {
    return null;
  }

  return (
    <section
      className={endorseStyles.sectionCherryPie}
      id={ENDORSED_PROVIDERS_SECTION_ID}
    >
      <div className={sectionStyles.container}>
        <div className={sectionStyles.header}>
          <div className={endorseStyles.headerBadgeFrame}>
            <Image
              src={badgeGeneric}
              alt={ENDORSED_PROVIDERS_BADGE_ALT}
              width={54}
              height={54}
              unoptimized
              className={endorseStyles.headerBadgeImg}
            />
          </div>
          <Typography
            variant={TypographyVariant.H2}
            color={TypographyColorToken.PureWhite}
          >
            {ENDORSED_PROVIDERS_HEADING}
          </Typography>
        </div>
        <Typography
          variant={TypographyVariant.Body1}
          color={TypographyColorToken.PureWhite}
          className={sectionStyles.subtitle}
        >
          {ENDORSED_PROVIDERS_SUBTITLE}
        </Typography>

        <div
          className={classNames(
            endorseStyles.cardsRow,
            providers.length === 2 && endorseStyles.cardsRowTwo,
            providers.length === 1 && endorseStyles.cardsRowSingle
          )}
        >
          {providers.map((provider) => {
            const providerName = providerNameFromId(provider.id);
            const providerSlug = slugify(provider.id);
            const providerRow = rawProviders.find(
              (item) => item.id === provider.id
            );
            const ndaCertified = providerRow?.ndaCertified === true;
            const cardLogoSrc = resolveEndorsedProviderLogoSrc(
              providerSlug,
              provider.logo,
              ENDORSED_PROVIDER_LOGO_BY_SLUG
            );
            const ctaHref = buildEndorsedProviderDetailHref(
              providerSlug,
              demoGuid
            );

            return (
              <InstitutionProviderCard
                key={provider.id}
                ctaHref={ctaHref}
                header={
                  provider.topBackgroundImage
                    ? {
                        kind: INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE,
                        src: provider.topBackgroundImage,
                      }
                    : {
                        kind: INSTITUTION_PROVIDER_HEADER_KIND.CHERRY_PIE_SUB,
                      }
                }
                badge={
                  <EndorsedCertifiedBadge
                    size='card'
                    certified={ndaCertified}
                  />
                }
                equalWidth={providers.length > 2}
                elevatedOnDark
                ndaCertified={ndaCertified}
                gaEvent={{
                  eventName: ENDORSED_PROVIDERS_GA.ctaClick.eventName,
                  category: ENDORSED_PROVIDERS_GA.ctaClick.category,
                  fileName: analyticsFileNameFromUrl(ctaHref),
                  params: {
                    provider_id: provider.id,
                    provider_name: providerName,
                    destination_url: ctaHref,
                    section: ENDORSED_PROVIDERS_GA.ctaClick.section,
                  },
                }}
                center={
                  <div className={cardStyles.logoWrap}>
                    <Image
                      src={cardLogoSrc}
                      alt={`${providerName} logo`}
                      width={280}
                      height={72}
                    />
                  </div>
                }
              />
            );
          })}
        </div>
        {showCertifiedLegend ? (
          <Typography
            variant={TypographyVariant.Body3}
            color={TypographyColorToken.PureWhite}
            className={endorseStyles.certifiedLegend}
          >
            <span
              className={endorseStyles.certifiedLegendStar}
              aria-hidden='true'
            >
              ★
            </span>{' '}
            NDA Certified — completed Neurodiversity Academy provider training
          </Typography>
        ) : null}
      </div>
    </section>
  );
}
