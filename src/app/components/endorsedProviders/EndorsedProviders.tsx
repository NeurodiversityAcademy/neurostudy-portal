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
          {providers.map((provider) => (
            <InstitutionProviderCard
              key={provider.id}
              pdfUrl={provider.pdfUrl}
              header={resolveHeader(provider.topBackgroundImage)}
              badge={badge}
              equalWidth
              elevatedOnDark
              gaEventName='endorsed_cta_click'
              gaCategory='Endorsed'
              gaFileName={analyticsFileNameFromPdfUrl(provider.pdfUrl)}
              center={
                <div className={cardStyles.logoWrap}>
                  <Image
                    src={provider.logo}
                    alt={`${provider.id.replace(/-/g, ' ')} logo`}
                    width={280}
                    height={72}
                  />
                </div>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
