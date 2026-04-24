'use client';

import ActionButton from '../buttons/ActionButton';
import { analyticsFileNameFromPdfUrl } from '@/app/utilities/analyticsFileName';
import { BUTTON_STYLE } from '@/app/utilities/constants';

type EmergingInstitutionCtaButtonProps = {
  pdfUrl: string;
  className: string;
  gaEventName?: string;
  gaCategory?: string;
  /** Optional override; default is derived from `pdfUrl` (used for GA `file_name`). */
  gaFileName?: string;
};

const EMERGING_CTA_LABEL = 'Explore More';
const DEFAULT_GA = {
  name: 'emerging_cta_click',
  category: 'Emerging',
} as const;

export default function EmergingInstitutionCtaButton({
  pdfUrl,
  className,
  gaEventName = DEFAULT_GA.name,
  gaCategory = DEFAULT_GA.category,
  gaFileName,
}: EmergingInstitutionCtaButtonProps) {
  const fileName = gaFileName ?? analyticsFileNameFromPdfUrl(pdfUrl);

  const handleCtaClick = () => {
    const gtag = (
      window as Window & {
        gtag?: (...args: unknown[]) => void;
      }
    ).gtag;

    gtag?.('event', gaEventName, {
      file_name: fileName,
      link_text: EMERGING_CTA_LABEL,
      category: gaCategory,
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
