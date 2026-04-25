'use client';

import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';

type EmergingInstitutionCtaButtonProps = {
  href: string;
  institutionName: string;
  className: string;
};

const EMERGING_CTA_LABEL = 'Explore More';
const EMERGING_GA_EVENT = {
  name: 'emerging_cta_click',
  category: 'Emerging',
  linkText: EMERGING_CTA_LABEL,
} as const;

export default function EmergingInstitutionCtaButton({
  href,
  institutionName,
  className,
}: EmergingInstitutionCtaButtonProps) {
  const handleCtaClick = () => {
    const gtag = (
      window as Window & {
        gtag?: (...args: unknown[]) => void;
      }
    ).gtag;

    gtag?.('event', EMERGING_GA_EVENT.name, {
      institution_name: institutionName,
      destination_path: href,
      link_text: EMERGING_GA_EVENT.linkText,
      category: EMERGING_GA_EVENT.category,
    });
  };

  return (
    <ActionButton
      label={EMERGING_CTA_LABEL}
      style={BUTTON_STYLE.Primary}
      className={className}
      to={href}
      openInNewTab={false}
      onClick={handleCtaClick}
    />
  );
}
