'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import TextBox from '../../formElements/TextBox/TextBox';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useImperativeHandle,
} from 'react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';
import { UserProps } from '@/app/interfaces/User';
import { CHALLENGE_FIELDS } from '@/app/utilities/profile/constants';

type UserChallengeProps = UserProps<(typeof CHALLENGE_FIELDS)[number]>;

const ProfileChallengeForm: ForwardRefExoticComponent<
  RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef>((_, ref) => {
  const { data, isLoading } = useProfileContext();

  const methods: UseFormReturn<UserChallengeProps> =
    useForm<UserChallengeProps>({
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
    <Form initialized={!isLoading} methods={methods}>
      <TextBox
        name='Comforts'
        label='Tell us about things you are comfortable with'
        showLabel
        placeholder='E.G. Online classes'
        helperText='This will help us create personalised experience for you'
        defaultValue={data?.Comforts?.join(', ') || ''}
      />
      <TextBox
        name='Struggles'
        label='Tell us about things that you have struggled with in the past'
        showLabel
        placeholder='E.G. Zoom Meetings'
        helperText='This will help us create personalised experience for you'
        defaultValue={data?.Struggles?.join(', ') || ''}
      />
      <TextBox
        name='Challenges'
        label='Tell us about the challenges that you have faced in the past'
        showLabel
        placeholder='E.G. Online Learning'
        helperText='This will help us create personalised experience for you'
        defaultValue={data?.Challenges?.join(', ') || ''}
      />
    </Form>
  );
});

ProfileChallengeForm.displayName = 'ProfileChallengeForm';

export default ProfileChallengeForm;
