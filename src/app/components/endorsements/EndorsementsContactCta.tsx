'use client';

import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE, ENDORSEMENTS_CTA_LABELS } from '@/app/utilities/constants';
import { sendContactCtaClickEvent } from '@/app/utilities/gaTracking';
import { sendMetaContactCtaLeadEvent } from '@/app/utilities/metaPixelTracking';
import styles from '../../endorsements/endorsements.module.css';

const CONTACT_PATH = '/contact';
const CONTACT_CTA_SECTION = 'endorsements_faq';

interface EndorsementsContactCtaProps {
  className?: string;
}

export default function EndorsementsContactCta({ className }: EndorsementsContactCtaProps) {
  const handleContactClick = () => {
    sendContactCtaClickEvent(CONTACT_PATH, CONTACT_CTA_SECTION);
    sendMetaContactCtaLeadEvent();
  };

  return (
    <ActionButton
      style={BUTTON_STYLE.Primary}
      label={ENDORSEMENTS_CTA_LABELS.CONTACT}
      className={className ?? styles.enrolBtn}
      to={CONTACT_PATH}
      onClick={handleContactClick}
    />
  );
}
