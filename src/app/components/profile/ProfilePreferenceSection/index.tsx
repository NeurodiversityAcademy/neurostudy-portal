'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import TextBox from '../../formElements/TextBox/TextBox';
import preferenceIcon from '@/app/images/preferenceIcon.svg';
import ProfileCard from '../ProfileCard';
import TextArea from '../../formElements/TextArea/TextArea';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useImperativeHandle,
} from 'react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';

const ProfilePreferenceSection: ForwardRefExoticComponent<
  RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef>((_, ref) => {
  const { data, isLoading } = useProfileContext();

  const methods: UseFormReturn = useForm({
    mode: 'onBlur',
  });

  useImperativeHandle(
    ref,
    () => ({
      methods,
    }),
    [methods]
  );

  return (
    <ProfileCard
      leftIconSrc={preferenceIcon}
      leftIconAlt='Neuro Condition & Learning Preferences'
      title='Neuro Condition & Learning Preferences'
      collapsible
      isLoading={isLoading}
    >
      <Form initialized={!isLoading} methods={methods}>
        <TextBox
          name='Conditions'
          label='Tell us about your Neuro-Condition'
          showLabel
          placeholder='E.G. ADHD'
          helperText='This will help us create personalised experience for you'
          defaultValue={data?.Conditions?.join(', ') || ''}
        />
        <TextBox
          name='Institutions'
          label='Learning Institutions'
          showLabel
          placeholder='E.G. California University'
          helperText='This will help us create personalised experience for you'
          defaultValue={data?.Institutions?.join(', ') || ''}
        />
        <TextArea
          name='EnvDescription'
          label='Describe a learning environment that you find ideal*'
          showLabel
          placeholder='Ex. - I prefer a remote setup with an option to opt for hybrid system'
          defaultValue={data?.EnvDescription || ''}
        />
      </Form>
    </ProfileCard>
  );
});

ProfilePreferenceSection.displayName = 'ProfilePreferenceSection';

export default ProfilePreferenceSection;
