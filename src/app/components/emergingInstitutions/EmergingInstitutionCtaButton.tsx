'use client';

import ActionButton from '../buttons/ActionButton';
import { analyticsFileNameFromPdfUrl } from '@/app/utilities/analyticsFileName';
import { BUTTON_STYLE } from '@/app/utilities/constants';

export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type InstitutionCtaAnalytics = {
  eventName?: string;
  category?: string;
  /** Optional override; default is derived from `pdfUrl` (used for GA `file_name`). */
  fileName?: string;
  params?: AnalyticsEventParams;
};

type EmergingInstitutionCtaButtonProps = {
  pdfUrl: string;
  className: string;
  analytics?: InstitutionCtaAnalytics;
};

const EMERGING_CTA_LABEL = 'Explore More';
const DEFAULT_GA = {
  name: 'emerging_cta_click',
  category: 'Emerging',
} as const;

export default function EmergingInstitutionCtaButton({
  pdfUrl,
  className,
  analytics,
}: EmergingInstitutionCtaButtonProps) {
  const eventName = analytics?.eventName ?? DEFAULT_GA.name;
  const category = analytics?.category ?? DEFAULT_GA.category;
  const fileName = analytics?.fileName ?? analyticsFileNameFromPdfUrl(pdfUrl);

  const handleCtaClick = () => {
    const gtag = (
      window as Window & {
        gtag?: (...args: unknown[]) => void;
      }
    ).gtag;

    gtag?.('event', eventName, {
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
      to={pdfUrl}
      openInNewTab={true}
      onClick={handleCtaClick}
    />
  );
}
