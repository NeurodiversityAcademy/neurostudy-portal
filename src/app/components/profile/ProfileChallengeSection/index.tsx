'use client';

import challengeIcon from '@/app/images/challengeIcon.svg';
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
import ProfileChallengeForm from './Form';
import ProfileAttributes from '../ProfileAttributes';
import { CHALLENGE_FIELDS } from '@/app/utilities/profile/constants';

const ProfileChallengeSection: ForwardRefExoticComponent<
  PropsWithoutRef<ProfileSectionProps> & RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef, ProfileSectionProps>(
  ({ popup = false, onSubmit, onCancel, onSectionEdit }, formRef) => {
    const { isLoading, isEditing } = useProfileContext();

    return (
      <ProfileCard
        leftIconSrc={challengeIcon}
        leftIconAlt='Comfort & Challenges'
        title='Comfort & Challenges'
        collapsible
        isLoading={isLoading}
        popup={popup}
      >
        {isEditing || popup ? (
          <ProfileChallengeForm
            ref={formRef}
            {...(popup ? { onSubmit, onCancel } : null)}
          />
        ) : (
          <ProfileAttributes
            fields={CHALLENGE_FIELDS}
            onSectionEdit={onSectionEdit}
          />
        )}
      </ProfileCard>
    );
  }
);

ProfileChallengeSection.displayName = 'ProfileChallengeSection';

export default ProfileChallengeSection;
