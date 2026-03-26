'use client';

import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';

type EmergingInstitutionCtaButtonProps = {
  pdfUrl: string;
  className: string;
};

const EMERGING_CTA_LABEL = 'Explore More';
const EMERGING_GA_EVENT = {
  name: 'emerging_cta_click',
  category: 'Emerging',
  linkText: EMERGING_CTA_LABEL,
} as const;

export default function EmergingInstitutionCtaButton({
  pdfUrl,
  className,
}: EmergingInstitutionCtaButtonProps) {
  const fileName = decodeURIComponent(pdfUrl.split('/').pop() ?? '').replace(
    /\+/g,
    ' '
  );

  const handleCtaClick = () => {
    const gtag = (
      window as Window & {
        gtag?: (...args: unknown[]) => void;
      }
    ).gtag;

    gtag?.('event', EMERGING_GA_EVENT.name, {
      file_name: fileName,
      link_text: EMERGING_GA_EVENT.linkText,
      category: EMERGING_GA_EVENT.category,
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
