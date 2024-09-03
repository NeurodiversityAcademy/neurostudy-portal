'use client';

import preferenceIcon from '@/app/images/preferenceIcon.svg';
import ProfileCard from '../ProfileCard';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import { ProfileSectionRef } from '@/app/interfaces/Profile';
import ProfilePreferenceForm from './Form';
import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import ProfileAttributes from '../ProfileAttributes';
import getProfileSectionData from '@/app/utilities/profile/getProfileSectionData';
import { PREFERENCE_FIELDS } from '@/app/utilities/profile/constants';

const ProfilePreferenceSection: ForwardRefExoticComponent<
  RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef>((_, formRef) => {
  const { data: _data, isLoading, isEditing } = useProfileContext();

  const data = _data && getProfileSectionData(_data, PREFERENCE_FIELDS);

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
        data && <ProfileAttributes data={data} />
      )}
    </ProfileCard>
  );
});

ProfilePreferenceSection.displayName = 'ProfilePreferenceSection';

export default ProfilePreferenceSection;
