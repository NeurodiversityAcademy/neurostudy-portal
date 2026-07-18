'use client';

import { useEffect, useRef, useState } from 'react';
import { DOCUMENT_VISIBILITY_HIDDEN, MILLISECONDS_PER_SECOND } from '@/app/utilities/gaTracking';

type TimeOnPageReporter = (seconds: number) => void;

function elapsedSeconds(startTimeMs: number): number {
  return Math.round((Date.now() - startTimeMs) / MILLISECONDS_PER_SECOND);
}

export function useTimeOnPageTracking(reportTimeOnPage: TimeOnPageReporter): void {
  const [startTimeMs] = useState(() => Date.now());
  const hasSentTime = useRef(false);

  useEffect(() => {
    const sendTimeOnPageOnce = () => {
      if (hasSentTime.current) {
        return;
      }
      hasSentTime.current = true;
      reportTimeOnPage(elapsedSeconds(startTimeMs));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === DOCUMENT_VISIBILITY_HIDDEN) {
        sendTimeOnPageOnce();
      }
    };

    window.addEventListener('beforeunload', sendTimeOnPageOnce);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', sendTimeOnPageOnce);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      sendTimeOnPageOnce();
    };
  }, [reportTimeOnPage, startTimeMs]);
}
