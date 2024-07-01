import React from 'react';
import CircleRight from '../../images/CircleRightOrg.jpg';
import ActionButton from './ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';

export default function myTertiary() {
  return (
    <ActionButton
      label='Learn more'
      icon={CircleRight}
      style={BUTTON_STYLE.Tertiary}
      disabled={false}
      iconPosition='right'
      onClick={() => console.log('clicked Tertiary button')}
    />
  );
}
