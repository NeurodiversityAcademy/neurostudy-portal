'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './emergingDirectory.module.css';
import cardData from './emergingInstitutions.json';
import Typography, { TypographyVariant } from '../typography/Typography';
import EmergingInstitutionCard from './EmergingInstitutionCard';
import EmergingProvidersStateRail from './EmergingProvidersStateRail';
import { shuffleInstitutions } from './shuffleInstitutions';
import {
  AU_STATE_LABELS,
  AU_STATE_ORDER,
  groupEmergingInstitutionsByState,
  type AustralianState,
  type EmergingInstitution,
  type EmergingInstitutionsByState,
} from './emergingInstitutionTypes';
import { trackEmergingStateJump } from './emergingProvidersGa';
import { stateSectionId } from './emergingProvidersDirectoryUtils';

const INSTITUTIONS = cardData as EmergingInstitution[];
const GROUPS = groupEmergingInstitutionsByState(INSTITUTIONS);
const AVAILABLE_STATES = GROUPS.map((group) => group.state);
const STATE_COUNTS: Partial<Record<AustralianState, number>> = Object.fromEntries(
  GROUPS.map((group) => [group.state, group.institutions.length]),
);

function shuffleGroups(groups: EmergingInstitutionsByState[]): EmergingInstitutionsByState[] {
  return groups.map((group) => ({
    ...group,
    institutions: shuffleInstitutions(group.institutions),
  }));
}

function parseStateFromLocation(): AustralianState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('state')?.toUpperCase();
  if (fromQuery && (AU_STATE_ORDER as readonly string[]).includes(fromQuery)) {
    return fromQuery as AustralianState;
  }

  const hash = window.location.hash.replace(/^#/, '');
  const hashMatch = /^emerging-state-([A-Z]+)$/.exec(hash);
  const fromHash = hashMatch?.[1];
  if (fromHash && (AU_STATE_ORDER as readonly string[]).includes(fromHash)) {
    return fromHash as AustralianState;
  }

  return null;
}

export default function EmergingProvidersDirectory() {
  const [groups, setGroups] = useState(GROUPS);
  const deepLinkTrackedRef = useRef(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setGroups(shuffleGroups(GROUPS));
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useLayoutEffect(() => {
    const deepLinkedState = parseStateFromLocation();
    if (!deepLinkedState || !AVAILABLE_STATES.includes(deepLinkedState)) {
      return;
    }

    const section = document.getElementById(stateSectionId(deepLinkedState));
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Active pill is set by IntersectionObserver after scroll — avoid sync setState in effect.

    if (!deepLinkTrackedRef.current) {
      deepLinkTrackedRef.current = true;
      trackEmergingStateJump({ state: deepLinkedState, source: 'deep_link' });
    }
  }, []);

  const handleStateJump = (state: AustralianState): void => {
    trackEmergingStateJump({ state, source: 'click' });
  };

  return (
    <section className={styles.directorySection} aria-label='NDA Emerging Providers directory'>
      <div className={styles.directoryContainer}>
        <div className={styles.directoryLayout}>
          <EmergingProvidersStateRail
            availableStates={AVAILABLE_STATES}
            stateCounts={STATE_COUNTS}
            onJump={handleStateJump}
          />

          <div className={styles.directoryMain}>
            <div className={styles.directoryStateGroups}>
              {groups.map(({ state, institutions }) => (
                <section
                  key={state}
                  id={stateSectionId(state)}
                  className={styles.directoryStateGroup}
                  aria-labelledby={`emerging-state-heading-${state}`}
                >
                  <Typography
                    id={`emerging-state-heading-${state}`}
                    variant={TypographyVariant.H3}
                    color='var(--cherryPie)'
                    className={styles.directoryStateHeading}
                  >
                    {AU_STATE_LABELS[state]}
                  </Typography>
                  <div className={styles.directoryCards}>
                    {institutions.map((institution) => (
                      <EmergingInstitutionCard
                        key={institution.name}
                        name={institution.name}
                        state={institution.state}
                        demo={institution.demo === true}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
