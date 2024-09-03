'use client';

import challengeIcon from '@/app/images/challengeIcon.svg';
import ProfileCard from '../ProfileCard';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';
import ProfileChallengeForm from './Form';
import ProfileAttributes from '../ProfileAttributes';
import { CHALLENGE_FIELDS, STRATEGY_FIELDS } from '@/app/utilities/profile/constants';

const ProfileChallengeSection: ForwardRefExoticComponent<
  RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef>((_, formRef) => {
  const { isLoading, isEditing } = useProfileContext();

  return (
    <ProfileCard
      leftIconSrc={challengeIcon}
      leftIconAlt='Comfort & Challenges'
      title='Comfort & Challenges'
      collapsible
      isLoading={isLoading}
    >
      {isEditing ? (
        <ProfileChallengeForm ref={formRef} />
      ) : (
        <ProfileAttributes fields={CHALLENGE_FIELDS} />
      )}
    </ProfileCard>
  );
});

ProfileChallengeSection.displayName = 'ProfileChallengeSection';

export default ProfileChallengeSection;
