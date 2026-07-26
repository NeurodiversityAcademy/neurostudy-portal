'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './emergingDirectory.module.css';
import cardData from './emergingInstitutions.json';
import Typography, { TypographyVariant } from '../typography/Typography';
import EmergingInstitutionCard from './EmergingInstitutionCard';
import { shuffleInstitutions } from './shuffleInstitutions';
import {
  AU_STATE_ORDER,
  AU_STATE_LABELS,
  groupEmergingInstitutionsByState,
  type AustralianState,
  type EmergingInstitution,
  type EmergingInstitutionsByState,
} from './emergingInstitutionTypes';
import { trackEmergingStateJump } from './emergingProvidersGa';

const INSTITUTIONS = cardData as EmergingInstitution[];

const DESKTOP_STICKY_OFFSET_PX = 87;
const MOBILE_STICKY_OFFSET_PX = 143;

function shuffleGroups(
  groups: EmergingInstitutionsByState[],
): EmergingInstitutionsByState[] {
  return groups.map((group) => ({
    ...group,
    institutions: shuffleInstitutions(group.institutions),
  }));
}

function stateSectionId(state: AustralianState): string {
  return `emerging-state-${state}`;
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

function stateFromSectionElement(element: Element): AustralianState | null {
  const match = /^emerging-state-([A-Z]+)$/.exec(element.id);
  const state = match?.[1];
  if (state && (AU_STATE_ORDER as readonly string[]).includes(state)) {
    return state as AustralianState;
  }
  return null;
}

function stickyNavOffsetPx(): number {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return DESKTOP_STICKY_OFFSET_PX;
  }
  return window.matchMedia('(max-width: 768px)').matches
    ? MOBILE_STICKY_OFFSET_PX
    : DESKTOP_STICKY_OFFSET_PX;
}

export default function EmergingProvidersDirectory() {
  // Shuffle once per client mount so order varies per visit without post-mount CLS.
  const [groups] = useState(() =>
    shuffleGroups(groupEmergingInstitutionsByState(INSTITUTIONS)),
  );
  const [activeState, setActiveState] = useState<AustralianState | null>(null);
  const deepLinkTrackedRef = useRef(false);

  const availableStates = useMemo(() => groups.map((group) => group.state), [groups]);

  const stateCounts = useMemo(() => {
    const counts: Partial<Record<AustralianState, number>> = {};
    for (const group of groups) {
      counts[group.state] = group.institutions.length;
    }
    return counts;
  }, [groups]);

  useLayoutEffect(() => {
    const deepLinkedState = parseStateFromLocation();
    if (!deepLinkedState || !availableStates.includes(deepLinkedState)) {
      return;
    }

    const section = document.getElementById(stateSectionId(deepLinkedState));
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Active pill is set by IntersectionObserver after scroll — avoid sync setState in effect.

    if (!deepLinkTrackedRef.current) {
      deepLinkTrackedRef.current = true;
      trackEmergingStateJump({ state: deepLinkedState, source: 'deep_link' });
    }
  }, [availableStates]);

  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') {
      return undefined;
    }

    const sections = availableStates
      .map((state) => document.getElementById(stateSectionId(state)))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        const topEntry = visibleEntries[0];
        if (!topEntry) {
          return;
        }

        const visibleState = stateFromSectionElement(topEntry.target);
        if (visibleState) {
          setActiveState(visibleState);
        }
      },
      {
        rootMargin: `-${stickyNavOffsetPx()}px 0px -55% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [availableStates]);

  const handleStateJump = (state: AustralianState) => {
    setActiveState(state);
    trackEmergingStateJump({ state, source: 'click' });
  };

  return (
    <section className={styles.directorySection} aria-label='NDA Emerging Providers directory'>
      <div className={styles.directoryContainer}>
        <div className={styles.directoryLayout}>
          <nav className={styles.directorySideNav} aria-label='Jump to state'>
            {availableStates.map((state) => (
              <a
                key={state}
                href={`#${stateSectionId(state)}`}
                className={classNames(
                  styles.directoryJumpPill,
                  activeState === state && styles.directoryJumpPillSelected,
                )}
                aria-current={activeState === state ? 'true' : undefined}
                onClick={() => handleStateJump(state)}
              >
                <span>{state}</span>
                <span className={styles.directoryJumpCount}>
                  {stateCounts[state] ?? 0}
                </span>
              </a>
            ))}
          </nav>

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
