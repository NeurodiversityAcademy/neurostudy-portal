'use client';

import preferenceIcon from '@/app/images/preferenceIcon.svg';
import ProfileCard from '../ProfileCard';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import { ProfileSectionRef } from '@/app/interfaces/Profile';
import ProfilePreferenceForm from './Form';
import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import ProfileAttributes from '../ProfileAttributes';
import { PREFERENCE_FIELDS } from '@/app/utilities/profile/constants';

const ProfilePreferenceSection: ForwardRefExoticComponent<
  RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef>((_, formRef) => {
  const { isLoading, isEditing } = useProfileContext();

  return (
    <ProfileCard
      leftIconSrc={preferenceIcon}
      leftIconAlt='Neuro Condition & Learning Preferences'
      title='Neuro Condition & Learning Preferences'
      collapsible
      isLoading={isLoading}
    >
      {isEditing ? (
        <ProfilePreferenceForm ref={formRef} />
      ) : (
        <ProfileAttributes fields={PREFERENCE_FIELDS} />
      )}
    </ProfileCard>
  );
});

ProfilePreferenceSection.displayName = 'ProfilePreferenceSection';

export default ProfilePreferenceSection;
