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
import endorsedData from './endorsedProviders.json';
import { providerNameFromId } from './providerName';

type EndorsedProviderRawRow = {
  id: string;
  logo: string;
  institutionCoursesUrl: string;
};

type EndorsedProviderRow = {
  id: string;
  logo: string;
  institutionCoursesUrl: string | null;
};

type EndorsedProvidersProps = {
  demoGuid: string;
  demoSlug: string;
};

function toEndorsedProviderRow(
  row: EndorsedProviderRawRow
): EndorsedProviderRow {
  return {
    id: row.id,
    logo: row.logo,
    institutionCoursesUrl: row.institutionCoursesUrl,
  };
}

function filterProvidersBySlug(
  providers: EndorsedProviderRow[],
  demoSlug: string
): EndorsedProviderRow[] {
  return providers.filter((provider) => slugify(provider.id) === demoSlug);
}

export default function EndorsedProviders({
  demoGuid,
  demoSlug,
}: EndorsedProvidersProps) {
  if (demoGuid === '' || demoSlug === '') {
    return null;
  }

  const rawProviders = endorsedData as EndorsedProviderRawRow[];
  const providers = filterProvidersBySlug(
    rawProviders.map(toEndorsedProviderRow),
    demoSlug
  );

  if (providers.length === 0) {
    return null;
  }

  const ctaHref = buildEndorsedProviderDetailHref(demoGuid);

  const badge = (
    <Image
      src={badgeGeneric}
      alt={ENDORSED_PROVIDERS_BADGE_ALT}
      width={48}
      height={48}
    />
  );

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
            providers.length === 1 && endorseStyles.cardsRowSingle
          )}
        >
          {providers.map((provider) => {
            const providerName = providerNameFromId(provider.id);
            const providerSlug = slugify(provider.id);
            const cardLogoSrc = resolveEndorsedProviderLogoSrc(
              providerSlug,
              provider.logo,
              ENDORSED_PROVIDER_LOGO_BY_SLUG
            );

            return (
              <InstitutionProviderCard
                key={provider.id}
                ctaHref={ctaHref}
                header={{
                  kind: INSTITUTION_PROVIDER_HEADER_KIND.CHERRY_PIE_SUB,
                }}
                badge={badge}
                equalWidth={providers.length > 1}
                elevatedOnDark
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
      </div>
    </section>
  );
}
