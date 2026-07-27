'use client';

import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { debounce } from '@/app/utilities/common';
import styles from './emergingDirectory.module.css';
import type { AustralianState } from './emergingInstitutionTypes';
import { trackEmergingStateJump } from './emergingProvidersGa';
import {
  MOBILE_BREAKPOINT_MEDIA_QUERY,
  selectActiveStateFromSections,
  stateSectionId,
  stickyNavOffsetPx,
} from './emergingProvidersDirectoryUtils';

const RESIZE_DEBOUNCE_MS = 150;

interface EmergingProvidersStateRailProps {
  availableStates: readonly AustralianState[];
  stateCounts: Partial<Record<AustralianState, number>>;
  onJump?: (state: AustralianState) => void;
}

function getObservedSections(availableStates: readonly AustralianState[]): HTMLElement[] {
  return availableStates
    .map((state) => document.getElementById(stateSectionId(state)))
    .filter((element): element is HTMLElement => element !== null);
}

export default function EmergingProvidersStateRail({
  availableStates,
  stateCounts,
  onJump,
}: EmergingProvidersStateRailProps) {
  const [activeState, setActiveState] = useState<AustralianState | null>(null);

  const syncActiveFromScroll = useCallback(() => {
    const sections = getObservedSections(availableStates);
    const nextState = selectActiveStateFromSections(sections, stickyNavOffsetPx());
    if (nextState) {
      setActiveState(nextState);
    }
  }, [availableStates]);

  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') {
      return undefined;
    }

    let observer: IntersectionObserver | null = null;

    const connectObserver = (): void => {
      observer?.disconnect();

      const sections = getObservedSections(availableStates);
      if (sections.length === 0) {
        return;
      }

      observer = new IntersectionObserver(
        () => {
          syncActiveFromScroll();
        },
        {
          rootMargin: `-${stickyNavOffsetPx()}px 0px -55% 0px`,
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        },
      );

      sections.forEach((section) => observer?.observe(section));
      syncActiveFromScroll();
    };

    connectObserver();

    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_MEDIA_QUERY);
    const handleBreakpointChange = (): void => {
      connectObserver();
    };
    const debouncedResize = debounce(connectObserver, RESIZE_DEBOUNCE_MS);

    mediaQuery.addEventListener('change', handleBreakpointChange);
    window.addEventListener('resize', debouncedResize);

    return () => {
      observer?.disconnect();
      mediaQuery.removeEventListener('change', handleBreakpointChange);
      window.removeEventListener('resize', debouncedResize);
    };
  }, [availableStates, syncActiveFromScroll]);

  const handleStateJump = (state: AustralianState): void => {
    setActiveState(state);
    if (onJump) {
      onJump(state);
      return;
    }
    trackEmergingStateJump({ state, source: 'click' });
  };

  return (
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
          <span className={styles.directoryJumpCount}>{stateCounts[state] ?? 0}</span>
        </a>
      ))}
    </nav>
  );
}
