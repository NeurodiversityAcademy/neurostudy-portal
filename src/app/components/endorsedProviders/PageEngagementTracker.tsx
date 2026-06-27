'use client';

import { ReactNode } from 'react';
import { useScrollDepth } from '@/app/hooks/useScrollDepth';
import { useGaEventReporter } from '@/app/hooks/useGaEventReporter';
import { useSectionVisibilityTracking } from '@/app/hooks/useSectionVisibilityTracking';
import { useTimeOnPageTracking } from '@/app/hooks/useTimeOnPageTracking';

interface PageEngagementTrackerProps {
  children: ReactNode;
  providerSlug: string;
}

export default function PageEngagementTracker({
  children,
  providerSlug,
}: PageEngagementTrackerProps) {
  const { reportScrollDepth, reportSectionVisible, reportTimeOnPage } =
    useGaEventReporter(providerSlug);

  useScrollDepth(reportScrollDepth);
  useSectionVisibilityTracking(reportSectionVisible);
  useTimeOnPageTracking(reportTimeOnPage);

  return <>{children}</>;
}
