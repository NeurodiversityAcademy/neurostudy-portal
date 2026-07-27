'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import styles from './emergingTeaser.module.css';
import cardData from './emergingInstitutions.json';
import graduationCap from '../../images/graduationCap.png';
import Typography, { TypographyVariant } from '../typography/Typography';
import EmergingInstitutionCtaButton from './EmergingInstitutionCtaButton';
import { EMERGING_PROVIDERS_DIRECTORY_PATH } from './emergingProvidersPaths';
import {
  groupEmergingInstitutionsByState,
  type AustralianState,
  type EmergingInstitution,
} from './emergingInstitutionTypes';
import { shuffleInstitutions } from './shuffleInstitutions';
import { buildEmergingProviderDetailHref } from '@/app/emergingproviders/emergingProviderMetadata';
import { slugify } from '@/app/utilities/common';
import {
  buildEmergingDirectoryViewAllAnalytics,
  trackEmergingInstitutePillClick,
  trackEmergingStateAutoSelect,
  trackEmergingStateSelect,
  VIEW_ALL_LINK_TEXT,
} from './emergingProvidersGa';
import { hasEmergingProviderProfile } from './emergingProviderProfileSlugs';

const INSTITUTIONS = cardData as EmergingInstitution[];
const GROUPS = groupEmergingInstitutionsByState(INSTITUTIONS);
const AVAILABLE_STATES = GROUPS.map((group) => group.state);
const VIEW_ALL_ANALYTICS = buildEmergingDirectoryViewAllAnalytics(VIEW_ALL_LINK_TEXT);

function pickRandomState(states: readonly AustralianState[]): AustralianState {
  const index = Math.floor(Math.random() * states.length);
  return states[index] ?? states[0]!;
}

export default function EmergingInstitutions() {
  const providerCount = INSTITUTIONS.length;

  const [selectedState, setSelectedState] = useState<AustralianState | null>(null);
  const [visibleInstitutions, setVisibleInstitutions] = useState<EmergingInstitution[]>([]);

  useEffect(() => {
    if (AVAILABLE_STATES.length === 0) {
      return undefined;
    }

    const frame = requestAnimationFrame(() => {
      const initialState = pickRandomState(AVAILABLE_STATES);
      const group = GROUPS.find((item) => item.state === initialState);
      setSelectedState(initialState);
      setVisibleInstitutions(shuffleInstitutions(group?.institutions ?? []));
      trackEmergingStateAutoSelect(initialState);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleStateSelect = (state: AustralianState) => {
    const wasAlreadySelected = selectedState === state;
    trackEmergingStateSelect({ state, wasAlreadySelected });

    if (wasAlreadySelected) {
      return;
    }

    const group = GROUPS.find((item) => item.state === state);
    setSelectedState(state);
    setVisibleInstitutions(shuffleInstitutions(group?.institutions ?? []));
  };

  const handleInstitutePillClick = (institution: EmergingInstitution) => {
    const providerSlug = slugify(institution.name);
    if (institution.demo || !hasEmergingProviderProfile(providerSlug)) {
      return;
    }

    const destinationPath = buildEmergingProviderDetailHref(providerSlug);
    trackEmergingInstitutePillClick({
      providerName: institution.name,
      providerSlug,
      state: institution.state,
      destinationPath,
      linkText: institution.name,
    });
  };

  return (
    <section className={styles.section} id='emerging-institutions'>
      <div className={styles.teaserContainer}>
        <div className={styles.teaserPanel}>
          <div className={styles.header}>
            <Image
              src={graduationCap}
              alt='Graduation cap icon'
              width={40}
              height={40}
              className={styles.icon}
            />
            <Typography variant={TypographyVariant.H2} color='var(--BondBlack)'>
              NDA Emerging Providers
            </Typography>
          </div>
          <Typography
            variant={TypographyVariant.Body1}
            color='var(--BondBlackVariant)'
            className={styles.subtitle}
          >
            Emerging Providers are organisations with developing practices and strong potential for
            neuro-inclusive education — across Australia.
          </Typography>

          <div
            className={styles.statePills}
            role='group'
            aria-label='Filter emerging providers by state'
          >
            {AVAILABLE_STATES.map((state) => {
              const isSelected = selectedState === state;
              return (
                <button
                  key={state}
                  type='button'
                  className={classNames(styles.statePill, isSelected && styles.statePillSelected)}
                  aria-pressed={isSelected}
                  onClick={() => handleStateSelect(state)}
                >
                  {state}
                </button>
              );
            })}
          </div>

          {selectedState ? (
            <div className={styles.institutePillsBlock}>
              <ul className={styles.teaserChips} aria-label={`${selectedState} emerging providers`}>
                {visibleInstitutions.map((institution) => {
                  const providerSlug = slugify(institution.name);
                  const isComingSoon =
                    institution.demo === true || !hasEmergingProviderProfile(providerSlug);
                  const href = buildEmergingProviderDetailHref(providerSlug);

                  return (
                    <li key={institution.name} className={styles.teaserChipItem}>
                      {isComingSoon ? (
                        <span className={classNames(styles.teaserChip, styles.teaserChipDemo)}>
                          <Typography
                            variant={TypographyVariant.Body2}
                            color='var(--BondBlackVariant)'
                          >
                            {institution.name}
                          </Typography>
                        </span>
                      ) : (
                        <a
                          href={href}
                          className={classNames(styles.teaserChip, styles.teaserChipLink)}
                          onClick={() => handleInstitutePillClick(institution)}
                        >
                          <Typography variant={TypographyVariant.Body2} color='var(--cherryPie)'>
                            {institution.name}
                          </Typography>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div className={styles.teaserFooter}>
            <Typography
              variant={TypographyVariant.Body3}
              color='var(--BondBlackVariant)'
              className={styles.teaserCount}
            >
              {providerCount} providers
            </Typography>
            <EmergingInstitutionCtaButton
              ctaHref={EMERGING_PROVIDERS_DIRECTORY_PATH}
              className={styles.teaserCta}
              label={VIEW_ALL_LINK_TEXT}
              analytics={VIEW_ALL_ANALYTICS}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
