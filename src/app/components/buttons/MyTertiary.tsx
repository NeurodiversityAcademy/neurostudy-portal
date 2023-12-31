'use client';

import React from 'react';
import CircleRight from '../../images/CircleRightOrg.svg';
import ActionButton, { ButtonStyle } from './ActionButton';

export default function myTertiary() {
  return (
    <ActionButton
      label='Learn more'
      icon={CircleRight}
      style={ButtonStyle.Tertiary}
      disabled={false}
      iconPosition='right'
      onClick={() => console.log('clicked Tertiary button')}
    />
  );
}
