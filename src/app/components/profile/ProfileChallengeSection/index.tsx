'use client';

import challengeIcon from '@/app/images/challengeIcon.svg';
import ProfileCard from '../ProfileCard';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';
import ProfileChallengeForm from './Form';
import ProfileAttributes from '../ProfileAttributes';
import { CHALLENGE_FIELDS } from '@/app/utilities/profile/constants';
import getProfileSectionData from '@/app/utilities/profile/getProfileSectionData';

const ProfileChallengeSection: ForwardRefExoticComponent<
  RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef>((_, formRef) => {
  const { data: _data, isLoading, isEditing } = useProfileContext();

  const data = _data && getProfileSectionData(_data, CHALLENGE_FIELDS);

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
        data && <ProfileAttributes data={data} />
      )}
    </ProfileCard>
  );
});

ProfileChallengeSection.displayName = 'ProfileChallengeSection';

export default ProfileChallengeSection;
