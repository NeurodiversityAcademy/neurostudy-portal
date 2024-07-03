'use client';

import React from 'react';
import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import { useRouter } from 'next/navigation';

interface ExploreMoreProps {
  dest: string;
}

const ExploreMore = ({ dest }: ExploreMoreProps) => {
  const router = useRouter();
  const navigateToArticles = () => {
    router.push(dest);
  };

  return (
    <ActionButton
      label='Explore more'
      style={BUTTON_STYLE.Primary}
      onClick={() => navigateToArticles()}
      className={'mt-4'}
    />
  );
};

export default ExploreMore;
