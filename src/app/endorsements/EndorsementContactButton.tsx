'use client';

import ActionButton from '../components/buttons/ActionButton';
import { BUTTON_STYLE } from '../utilities/constants';
import { trackEndorsedProvidersPageCtaClick } from './analytics';

type EndorsementContactButtonProps = {
  className?: string;
};

const CONTACT_LABEL = 'Contact us for endorsement';
const CONTACT_PATH = '/contact';

export default function EndorsementContactButton({
  className,
}: EndorsementContactButtonProps) {
  return (
    <ActionButton
      style={BUTTON_STYLE.Primary}
      label={CONTACT_LABEL}
      className={className}
      to={CONTACT_PATH}
      onClick={trackEndorsedProvidersPageCtaClick}
    />
  );
}
