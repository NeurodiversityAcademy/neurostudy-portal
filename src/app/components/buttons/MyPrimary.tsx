'use client';

import React from 'react';
import Search from '../../images/Search.jpg';
import ActionButton from './ActionButton';

export default function myPrimary() {
  return (
    <ActionButton
      label='Search'
      icon={Search}
      disabled={false}
      onClick={() => console.log('clicked Primary button')}
    />
  );
}
