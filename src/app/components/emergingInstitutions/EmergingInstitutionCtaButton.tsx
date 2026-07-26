'use client';

import ActionButton from '../buttons/ActionButton';
import { analyticsFileNameFromUrl } from '@/app/utilities/analyticsFileName';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import { sendGaEvent, type GaEventParams } from '@/app/utilities/gaTracking';

export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

export type InstitutionCtaAnalytics = {
  eventName?: string;
  category?: string;
  fileName?: string;
  params?: AnalyticsEventParams;
};

type EmergingInstitutionCtaButtonProps = {
  /** Internal path or external URL for navigation and GA `destination_path`. */
  ctaHref: string;
  className: string;
  analytics?: InstitutionCtaAnalytics;
  openInNewTab?: boolean;
  /** Defaults to "Explore More" (provider cards). */
  label?: string;
};

const DEFAULT_EMERGING_CTA_LABEL = 'Explore More';
const DEFAULT_GA = {
  eventName: 'emerging_cta_click',
  category: 'Emerging',
} as const;

function toGaParams(params: AnalyticsEventParams | undefined): GaEventParams {
  if (!params) {
    return {};
  }

  const result: GaEventParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      continue;
    }
    result[key] = value;
  }
  return result;
}

export default function EmergingInstitutionCtaButton({
  ctaHref,
  className,
  analytics,
  openInNewTab = false,
  label = DEFAULT_EMERGING_CTA_LABEL,
}: EmergingInstitutionCtaButtonProps) {
  const eventName = analytics?.eventName ?? DEFAULT_GA.eventName;
  const category = analytics?.category ?? DEFAULT_GA.category;
  const fileName = analytics?.fileName ?? analyticsFileNameFromUrl(ctaHref);

  const handleCtaClick = () => {
    sendGaEvent(eventName, {
      destination_path: ctaHref,
      file_name: fileName,
      link_text: label,
      category,
      page_path: window.location.pathname,
      ...toGaParams(analytics?.params),
    });
  };

  return (
    <ActionButton
      label={label}
      style={BUTTON_STYLE.Primary}
      className={className}
      to={ctaHref}
      openInNewTab={openInNewTab}
      onClick={handleCtaClick}
    />
  );
}
