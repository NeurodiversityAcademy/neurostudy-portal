'use client';

import { useCallback } from 'react';
import {
  sendScrollDepthEvent,
  sendSectionVisibleEvent,
  sendTimeOnPageEvent,
} from '@/app/utilities/gaTracking';

export function useGaEventReporter(providerSlug: string) {
  const reportScrollDepth = useCallback(
    (percent: number) => {
      sendScrollDepthEvent(providerSlug, percent);
    },
    [providerSlug],
  );

  const reportSectionVisible = useCallback(
    (section: string) => {
      sendSectionVisibleEvent(providerSlug, section);
    },
    [providerSlug],
  );

  const reportTimeOnPage = useCallback(
    (seconds: number) => {
      sendTimeOnPageEvent(providerSlug, seconds);
    },
    [providerSlug],
  );

  return {
    reportScrollDepth,
    reportSectionVisible,
    reportTimeOnPage,
  };
}
