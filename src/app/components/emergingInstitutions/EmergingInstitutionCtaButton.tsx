'use client';

import ActionButton from '../buttons/ActionButton';
import { analyticsFileNameFromUrl } from '@/app/utilities/analyticsFileName';
import { BUTTON_STYLE } from '@/app/utilities/constants';

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
};

const EMERGING_CTA_LABEL = 'Explore More';
const DEFAULT_GA = {
  name: 'emerging_cta_click',
  category: 'Emerging',
} as const;

export default function EmergingInstitutionCtaButton({
  ctaHref,
  className,
  analytics,
  openInNewTab = false,
}: EmergingInstitutionCtaButtonProps) {
  const eventName = analytics?.eventName ?? DEFAULT_GA.name;
  const category = analytics?.category ?? DEFAULT_GA.category;
  const fileName = analytics?.fileName ?? analyticsFileNameFromUrl(ctaHref);

  const handleCtaClick = () => {
    const gtag = (
      window as Window & {
        gtag?: (...args: unknown[]) => void;
      }
    ).gtag;

    gtag?.('event', eventName, {
      destination_path: ctaHref,
      file_name: fileName,
      link_text: EMERGING_CTA_LABEL,
      category,
      ...analytics?.params,
    });
  };

  return (
    <ActionButton
      label={EMERGING_CTA_LABEL}
      style={BUTTON_STYLE.Primary}
      className={className}
      to={ctaHref}
      openInNewTab={openInNewTab}
      onClick={handleCtaClick}
    />
  );
}
