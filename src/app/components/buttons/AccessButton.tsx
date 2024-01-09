'use client';

import React from 'react';

import ActionButton from './ActionButton';

export default function myAccess() {
  return (
    <ActionButton
      label='Access courses'
      disabled={false}
      onClick={() => console.log('clicked Access courses button')}
    />
  );
}
