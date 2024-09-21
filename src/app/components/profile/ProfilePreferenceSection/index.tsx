'use client';

import preferenceIcon from '@/app/images/preferenceIcon.svg';
import ProfileCard from '../ProfileCard';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import {
  ProfileSectionProps,
  ProfileSectionRef,
} from '@/app/interfaces/Profile';
import ProfilePreferenceForm from './Form';
import {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import ProfileAttributes from '../ProfileAttributes';
import { PREFERENCE_FIELDS } from '@/app/utilities/profile/constants';

const ProfilePreferenceSection: ForwardRefExoticComponent<
  PropsWithoutRef<ProfileSectionProps> & RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef, ProfileSectionProps>(
  ({ popup = false, onSubmit, onCancel, onSectionEdit }, formRef) => {
    const { isLoading, isEditing } = useProfileContext();

    return (
      <ProfileCard
        leftIconSrc={preferenceIcon}
        leftIconAlt='Neuro Condition & Learning Preferences'
        title='Neuro Condition & Learning Preferences'
        collapsible
        isLoading={isLoading}
        popup={popup}
      >
        {isEditing || popup ? (
          <ProfilePreferenceForm
            ref={formRef}
            {...(popup ? { onSubmit, onCancel } : null)}
          />
        ) : (
          <ProfileAttributes
            fields={PREFERENCE_FIELDS}
            onSectionEdit={onSectionEdit}
          />
        )}
      </ProfileCard>
    );
  }
);

ProfilePreferenceSection.displayName = 'ProfilePreferenceSection';

export default ProfilePreferenceSection;
