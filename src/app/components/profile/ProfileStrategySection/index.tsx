'use client';

import strategyIcon from '@/app/images/strategyIcon.svg';
import ProfileCard from '../ProfileCard';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';
import { STRATEGY_FIELDS } from '@/app/utilities/profile/constants';
import ProfileStrategyForm from './Form';
import ProfileAttributes from '../ProfileAttributes';

const ProfileStrategySection: ForwardRefExoticComponent<
  RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef>((_, formRef) => {
  const { isLoading, isEditing } = useProfileContext();

  return (
    <ProfileCard
      leftIconSrc={strategyIcon}
      leftIconAlt='Strategies & Support'
      title='Strategies & Support'
      collapsible
      isLoading={isLoading}
    >
      {isEditing ? (
        <ProfileStrategyForm ref={formRef} />
      ) : (
        <ProfileAttributes fields={STRATEGY_FIELDS} />
      )}
    </ProfileCard>
  );
});

ProfileStrategySection.displayName = 'ProfileStrategySection';

export default ProfileStrategySection;
