import InstitutionProviderCard from '../institutionProviderCard/InstitutionProviderCard';
import { INSTITUTION_PROVIDER_HEADER_KIND } from '../institutionProviderCard/institutionProviderHeader';
import styles from '../institutionProviderCard/institutionProviderCard.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import { TypographyColorToken } from '../typography/typographyColorToken';
import type { AustralianState } from './emergingInstitutionTypes';
import { slugify } from '@/app/utilities/common';
import { buildEmergingExploreMoreAnalytics } from './emergingProvidersGa';
import type { InstitutionCtaAnalytics } from './EmergingInstitutionCtaButton';
import { resolveEmergingProviderHref } from './resolveEmergingProviderHref';

type EmergingInstitutionCardProps = {
  name: string;
  state: AustralianState;
  demo?: boolean;
  /** When set, replaces the default emerging-directory Explore More analytics. */
  gaEvent?: InstitutionCtaAnalytics;
  /** Open detail links in a new tab (directory default). Search results keep same-tab. */
  ctaOpenInNewTab?: boolean;
};

function resolveEmergingCta(params: {
  name: string;
  state: AustralianState;
  demo: boolean;
  gaEventOverride?: InstitutionCtaAnalytics;
}): {
  href: string | undefined;
  comingSoonLabel: string | undefined;
  gaEvent: InstitutionCtaAnalytics | undefined;
} {
  const href = resolveEmergingProviderHref({ name: params.name, demo: params.demo });
  if (!href) {
    return {
      href: undefined,
      comingSoonLabel: 'Coming soon',
      gaEvent: params.gaEventOverride,
    };
  }

  const defaultGaEvent = buildEmergingExploreMoreAnalytics({
    providerName: params.name,
    providerSlug: slugify(params.name),
    state: params.state,
    destinationPath: href,
  });

  return {
    href,
    comingSoonLabel: undefined,
    gaEvent: params.gaEventOverride ?? defaultGaEvent,
  };
}

export default function EmergingInstitutionCard({
  name,
  state,
  demo = false,
  gaEvent: gaEventOverride,
  ctaOpenInNewTab = true,
}: EmergingInstitutionCardProps) {
  const cta = resolveEmergingCta({ name, state, demo, gaEventOverride });

  return (
    <InstitutionProviderCard
      ctaHref={cta.href}
      ctaOpenInNewTab={ctaOpenInNewTab}
      compact
      comingSoonLabel={cta.comingSoonLabel}
      gaEvent={cta.gaEvent}
      header={{
        kind: INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT,
        stateTint: state,
      }}
      center={
        <div className={styles.nameWrap}>
          <div className={styles.nameStack}>
            <Typography variant={TypographyVariant.Body2}>{name}</Typography>
            <Typography
              variant={TypographyVariant.Body3}
              color={TypographyColorToken.CherryPieVariant}
            >
              {state}
            </Typography>
          </div>
        </div>
      }
    />
  );
}
