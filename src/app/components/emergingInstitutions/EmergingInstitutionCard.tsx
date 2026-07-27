import InstitutionProviderCard, {
  INSTITUTION_PROVIDER_HEADER_KIND,
} from '../institutionProviderCard/InstitutionProviderCard';
import styles from '../institutionProviderCard/institutionProviderCard.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import type { AustralianState } from './emergingInstitutionTypes';
import { buildEmergingProviderDetailHref } from '@/app/emergingproviders/emergingProviderMetadata';
import { slugify } from '@/app/utilities/common';
import { buildEmergingExploreMoreAnalytics } from './emergingProvidersGa';
import { hasEmergingProviderProfile } from './emergingProviderProfileSlugs';

type EmergingInstitutionCardProps = {
  name: string;
  state: AustralianState;
  demo?: boolean;
};

export default function EmergingInstitutionCard({
  name,
  state,
  demo = false,
}: EmergingInstitutionCardProps) {
  const providerSlug = slugify(name);
  const isComingSoon = demo || !hasEmergingProviderProfile(providerSlug);
  const href = isComingSoon ? undefined : buildEmergingProviderDetailHref(providerSlug);
  const gaEvent =
    href === undefined
      ? undefined
      : buildEmergingExploreMoreAnalytics({
          providerName: name,
          providerSlug,
          state,
          destinationPath: href,
        });

  return (
    <InstitutionProviderCard
      ctaHref={href}
      ctaOpenInNewTab
      compact
      comingSoonLabel={isComingSoon ? 'Coming soon' : undefined}
      gaEvent={
        gaEvent
          ? {
              eventName: gaEvent.eventName,
              category: gaEvent.category,
              fileName: gaEvent.fileName,
              params: gaEvent.params,
            }
          : undefined
      }
      header={{
        kind: INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT,
        stateTint: state,
      }}
      center={
        <div className={styles.nameWrap}>
          <div className={styles.nameStack}>
            <Typography variant={TypographyVariant.Body2}>{name}</Typography>
            <Typography variant={TypographyVariant.Body3} color='var(--cherryPieVariant)'>
              {state}
            </Typography>
          </div>
        </div>
      }
    />
  );
}
