import Image from 'next/image';
import InstitutionProviderCard, {
  type InstitutionProviderHeader,
} from '../institutionProviderCard/InstitutionProviderCard';
import cardStyles from '../institutionProviderCard/institutionProviderCard.module.css';
import sectionStyles from '../emergingInstitutions/emergingInstitutions.module.css';
import endorseStyles from './endorsedProviders.module.css';
import badgeGeneric from '../../images/badgeGeneric.png';
import Typography, { TypographyVariant } from '../typography/Typography';
import { analyticsFileNameFromPdfUrl } from '@/app/utilities/analyticsFileName';
import endorsedData from './endorsedProviders.json';
import { providerNameFromId } from './providerName';

const ENDORSED_PROVIDERS_GA = {
  ctaClick: {
    eventName: 'endorsed_cta_click',
    category: 'Endorsed',
    section: 'endorsed_providers_cards',
  },
} as const;

type EndorsedProviderRow = {
  id: string;
  logo: string;
  pdfUrl: string;
  topBackgroundImage?: string;
};

function resolveHeader(topBackgroundImage?: string): InstitutionProviderHeader {
  const trimmed = topBackgroundImage?.trim();
  if (trimmed) {
    return { kind: 'remoteImage', src: trimmed };
  }
  return { kind: 'yellow' };
}

export default function EndorsedProviders() {
  const providers = endorsedData as EndorsedProviderRow[];

  const badge = (
    <Image
      src={badgeGeneric}
      alt='Endorsed Learning Organisation'
      width={48}
      height={48}
    />
  );

  return (
    <section
      className={endorseStyles.sectionCherryPie}
      id='nda-endorsed-providers'
    >
      <div className={sectionStyles.container}>
        <div className={sectionStyles.header}>
          <div className={endorseStyles.headerBadgeFrame}>
            <Image
              src={badgeGeneric}
              alt='Endorsed Learning Organisation'
              width={54}
              height={54}
              unoptimized
              className={endorseStyles.headerBadgeImg}
            />
          </div>
          <Typography variant={TypographyVariant.H2} color='var(--pure-white)'>
            NDA Endorsed Providers
          </Typography>
        </div>
        <Typography
          variant={TypographyVariant.Body1}
          color='var(--pure-white)'
          className={sectionStyles.subtitle}
        >
          Endorsed Providers meet Neurodiversity Academy standards for
          neuro-inclusive education and practice.
        </Typography>

        <div className={endorseStyles.cardsRow}>
          {providers.map((provider) => {
            const providerName = providerNameFromId(provider.id);

            return (
              <InstitutionProviderCard
                key={provider.id}
                pdfUrl={provider.pdfUrl}
                header={resolveHeader(provider.topBackgroundImage)}
                badge={badge}
                equalWidth
                elevatedOnDark
                gaEvent={{
                  eventName: ENDORSED_PROVIDERS_GA.ctaClick.eventName,
                  category: ENDORSED_PROVIDERS_GA.ctaClick.category,
                  fileName: analyticsFileNameFromPdfUrl(provider.pdfUrl),
                  params: {
                    provider_id: provider.id,
                    provider_name: providerName,
                    destination_url: provider.pdfUrl,
                    section: ENDORSED_PROVIDERS_GA.ctaClick.section,
                  },
                }}
                center={
                  <div className={cardStyles.logoWrap}>
                    <Image
                      src={provider.logo}
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
