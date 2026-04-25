'use client';
import React, { useCallback } from 'react';
import Image from 'next/image';
import styles from './endorsedInstitues.module.css';
import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';
import LeftArrow from '../../images/arrow_left.png';
import RightArrow from '../../images/arrow_right.png';
import useEmblaCarouse from 'embla-carousel-react';
import AccessInstitute from '../../images/logo_access_institute.jpeg';
import BlueprintCD from '../../images/logo_blueprint_cd.jpeg';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import ActionButton from '../buttons/ActionButton';

const ENDORSED_INSTITUTES_GA = {
  category: 'Endorsed',
  providerWebsiteClick: 'endorsed_provider_website_click',
  carouselNavigationClick: 'endorsed_provider_carousel_navigation_click',
  carouselCtaClick: 'endorsed_provider_carousel_cta_click',
} as const;
const BLUEPRINT_CAREER_DEVELOPMENT_URL = 'https://www.blueprintcd.com.au/';
const ACCESS_INSTITUTE_URL = 'https://accessinstitute.com.au';
const ENDORSEMENTS_PATH = '/endorsements';

export default function EndorsedInstitutes() {
  const [emblaRef, emblaApi] = useEmblaCarouse({ loop: true, skipSnaps: true });

  const trackEvent = useCallback(
    (
      eventName: string,
      eventParams?: Record<string, string | number | boolean | null | undefined>
    ) => {
      const gtag = (
        window as Window & {
          gtag?: (...args: unknown[]) => void;
        }
      ).gtag;

      gtag?.('event', eventName, {
        category: ENDORSED_INSTITUTES_GA.category,
        section: 'endorsed_institutes_carousel',
        ...eventParams,
      });
    },
    []
  );

  const trackProviderWebsiteClick = (
    providerName: string,
    destinationUrl: string
  ) => {
    trackEvent(ENDORSED_INSTITUTES_GA.providerWebsiteClick, {
      provider_name: providerName,
      destination_url: destinationUrl,
      link_text: providerName,
    });
  };

  const scrollPrev = useCallback(() => {
    trackEvent(ENDORSED_INSTITUTES_GA.carouselNavigationClick, {
      direction: 'previous',
    });
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi, trackEvent]);

  const scrollNext = useCallback(() => {
    trackEvent(ENDORSED_INSTITUTES_GA.carouselNavigationClick, {
      direction: 'next',
    });
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi, trackEvent]);

  const trackExploreMoreClick = () => {
    trackEvent(ENDORSED_INSTITUTES_GA.carouselCtaClick, {
      link_text: 'Explore more',
      destination_path: ENDORSEMENTS_PATH,
    });
  };

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
          Leading Institutes endorsed by Neurodiversity Academy
        </Typography>
      </div>
      <div className={styles.embla}>
        <div className={styles.button_container}>
          <button onClick={scrollPrev} aria-label='Previous endorsed provider'>
            <Image src={LeftArrow} alt='' />
          </button>
          <button onClick={scrollNext} aria-label='Next endorsed provider'>
            <Image src={RightArrow} alt='' />
          </button>
        </div>
        <div className={styles.embla__viewport} ref={emblaRef}>
          <div className={styles.embla__container}>
            <div className={styles.embla__slide}>
              <a
                href={BLUEPRINT_CAREER_DEVELOPMENT_URL}
                target='_blank'
                rel='noopener noreferrer'
                onClick={() =>
                  trackProviderWebsiteClick(
                    'Blueprint Career Development',
                    BLUEPRINT_CAREER_DEVELOPMENT_URL
                  )
                }
              >
                <Image
                  src={BlueprintCD}
                  alt='Blueprint Career Development logo'
                  title='Blueprint Career Development'
                />
              </a>
            </div>
            <div className={styles.embla__slide}>
              <a
                href={ACCESS_INSTITUTE_URL}
                target='_blank'
                rel='noopener noreferrer'
                onClick={() =>
                  trackProviderWebsiteClick(
                    'Access Institute',
                    ACCESS_INSTITUTE_URL
                  )
                }
              >
                <Image
                  src={AccessInstitute}
                  alt='Access Institute logo'
                  title='Access Institute'
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.exploreButton}>
        <ActionButton
          label='Explore more'
          style={BUTTON_STYLE.Primary}
          to={ENDORSEMENTS_PATH}
          className={'mt-4'}
          onClick={trackExploreMoreClick}
        />
      </div>
    </div>
  );
}
