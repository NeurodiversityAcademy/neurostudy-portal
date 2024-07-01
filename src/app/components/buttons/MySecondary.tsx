import React from 'react';
import Search from '../../images/SearchOrg.jpg';
import ActionButton from './ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';

export default function mySecondary() {
  return (
    <ActionButton
      label='Search'
      icon={Search}
      style={BUTTON_STYLE.Secondary}
      disabled={false}
      onClick={() => console.log('clicked Secondary button')}
    />
  );
}
