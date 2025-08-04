'use client';
import ActionButton from './buttons/ActionButton';
import { BUTTON_STYLE } from '../utilities/constants';

export default function ContactButton({ className }: { className?: string }) {
  return (
    <ActionButton
      style={BUTTON_STYLE.Primary}
      label='Contact us for endorsement'
      className={className}
    />
  );
}
