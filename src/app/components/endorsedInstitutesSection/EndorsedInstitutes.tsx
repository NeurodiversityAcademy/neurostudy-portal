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

export default function EndorsedInstitutes() {
  const [emblaRef, emblaApi] = useEmblaCarouse({ loop: true, skipSnaps: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
          Leading institues endorsed by Neurodiversity Academy
        </Typography>
      </div>
      <div className={styles.embla}>
        <div className={styles.button_container}>
          <button onClick={scrollPrev}>
            <Image src={LeftArrow} alt='next item' />
          </button>
          <button onClick={scrollNext}>
            <Image src={RightArrow} alt='next item' />
          </button>
        </div>
        <div className={styles.embla__viewport} ref={emblaRef}>
          <div className={styles.embla__container}>
            <div className={styles.embla__slide}>
              <a href='https://www.blueprintcd.com.au/' target='_blank'>
                <Image
                  src={BlueprintCD}
                  alt='Blueprint Career Development logo'
                  title='Blueprint Career Development'
                />
              </a>
            </div>
            <div className={styles.embla__slide}>
              <a href='https://accessinstitute.com.au' target='_blank'>
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
          to='/endorsements'
          className={'mt-4'}
        />
      </div>
    </div>
  );
}
