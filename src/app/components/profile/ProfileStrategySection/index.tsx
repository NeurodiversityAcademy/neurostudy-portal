'use client';

import strategyIcon from '@/app/images/strategyIcon.svg';
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
import { STRATEGY_FIELDS } from '@/app/utilities/profile/constants';
import ProfileStrategyForm from './Form';
import ProfileAttributes from '../ProfileAttributes';

const ProfileStrategySection: ForwardRefExoticComponent<
  PropsWithoutRef<ProfileSectionProps> & RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef, ProfileSectionProps>(
  ({ popup = false, onSubmit, onCancel, onSectionEdit }, formRef) => {
    const { isLoading, isEditing } = useProfileContext();

    return (
      <ProfileCard
        leftIconSrc={strategyIcon}
        leftIconAlt='Strategies & Support'
        title='Strategies & Support'
        collapsible
        isLoading={isLoading}
        popup={popup}
      >
        {isEditing || popup ? (
          <ProfileStrategyForm
            ref={formRef}
            {...(popup ? { onSubmit, onCancel } : null)}
          />
        ) : (
          <ProfileAttributes
            fields={STRATEGY_FIELDS}
            onSectionEdit={onSectionEdit}
          />
        )}
      </ProfileCard>
    );
  }
);

ProfileStrategySection.displayName = 'ProfileStrategySection';

export default ProfileStrategySection;
