'use client';

import { useEffect, useState } from 'react';

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

/**
 * Default hard timeout — past early paint, still catches brief non-interactive stays.
 */
export const DEFERRED_ACTIVATION_MS = 2000;

/**
 * Returns true after the first user interaction, or after `hardTimeoutMs`.
 * Prefer this over requestIdleCallback for analytics embeds — idle often fires
 * within ~1s on empty main threads and still tanks Speed Index.
 */
export const useDeferredActivation = (hardTimeoutMs: number = DEFERRED_ACTIVATION_MS): boolean => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive) {
      return;
    }

    let isCancelled = false;

    const activate = (): void => {
      if (!isCancelled) {
        setIsActive(true);
      }
    };

    const onInteraction = (): void => {
      activate();
    };

    const timeoutId = window.setTimeout(activate, hardTimeoutMs);

    INTERACTION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, onInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
      INTERACTION_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, onInteraction);
      });
    };
  }, [hardTimeoutMs, isActive]);

  return isActive;
};
