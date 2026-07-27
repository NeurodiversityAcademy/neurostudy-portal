'use client';

import classNames from 'classnames';
import ActionButton from '../buttons/ActionButton';
import buttonStyles from '../buttons/button.module.css';
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
  /**
   * Visual-only CTA when the parent card owns the navigation link
   * (avoids nested interactive controls).
   */
  decorative?: boolean;
};

export const DEFAULT_INSTITUTION_CTA_LABEL = 'Explore More';

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

interface TrackInstitutionCtaClickParams {
  ctaHref: string;
  analytics?: InstitutionCtaAnalytics;
  label?: string;
}

export function trackInstitutionCtaClick({
  ctaHref,
  analytics,
  label = DEFAULT_INSTITUTION_CTA_LABEL,
}: TrackInstitutionCtaClickParams): void {
  const eventName = analytics?.eventName ?? DEFAULT_GA.eventName;
  const category = analytics?.category ?? DEFAULT_GA.category;
  const fileName = analytics?.fileName ?? analyticsFileNameFromUrl(ctaHref);

  sendGaEvent(eventName, {
    destination_path: ctaHref,
    file_name: fileName,
    link_text: label,
    category,
    page_path: window.location.pathname,
    ...toGaParams(analytics?.params),
  });
}

export default function EmergingInstitutionCtaButton({
  ctaHref,
  className,
  analytics,
  openInNewTab = false,
  label = DEFAULT_INSTITUTION_CTA_LABEL,
  decorative = false,
}: EmergingInstitutionCtaButtonProps) {
  if (decorative) {
    return (
      <span
        className={classNames(buttonStyles.common, buttonStyles.primary, className)}
        aria-hidden='true'
      >
        {label}
      </span>
    );
  }

  const handleCtaClick = () => {
    trackInstitutionCtaClick({ ctaHref, analytics, label });
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
