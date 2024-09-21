'use client';

import goalIcon from '@/app/images/goalIcon.svg';
import ProfileCard from '../ProfileCard';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import {
  ProfileSectionProps,
  ProfileSectionRef,
} from '@/app/interfaces/Profile';
import ProfileGoalForm from './Form';
import ProfileAttributes from '../ProfileAttributes';
import { GOAL_FIELDS } from '@/app/utilities/profile/constants';

const ProfileGoalSection: ForwardRefExoticComponent<
  PropsWithoutRef<ProfileSectionProps> & RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef, ProfileSectionProps>(
  ({ popup = false, onSubmit, onCancel, onSectionEdit }, formRef) => {
    const { isLoading, isEditing } = useProfileContext();

    return (
      <ProfileCard
        leftIconSrc={goalIcon}
        leftIconAlt='Goals & Interests'
        title='Goals & Interests'
        collapsible
        isLoading={isLoading}
        popup={popup}
      >
        {isEditing || popup ? (
          <ProfileGoalForm
            ref={formRef}
            {...(popup ? { onSubmit, onCancel } : null)}
          />
        ) : (
          <ProfileAttributes
            fields={GOAL_FIELDS}
            onSectionEdit={onSectionEdit}
          />
        )}
      </ProfileCard>
    );
  }
);

ProfileGoalSection.displayName = 'ProfileGoalSection';

export default ProfileGoalSection;
