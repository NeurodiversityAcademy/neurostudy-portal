'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useImperativeHandle,
} from 'react';
import {
  ProfileSectionFormProps,
  ProfileSectionRef,
} from '@/app/interfaces/Profile';
import { UserProps } from '@/app/interfaces/User';
import {
  CHALLENGE_FIELDS,
  PROFILE_FIELD_OPTIONS,
  USER_DATA_KEY,
} from '@/app/utilities/profile/constants';
import ProfileFormFooter from '../ProfileFormFooter';
import Dropdown from '../../formElements/Dropdown/Dropdown';

type UserChallengeProps = UserProps<(typeof CHALLENGE_FIELDS)[number]>;

const ProfileChallengeForm: ForwardRefExoticComponent<
  PropsWithoutRef<ProfileSectionFormProps> & RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef, ProfileSectionFormProps>(
  ({ onSubmit, onCancel }, ref) => {
    const { data } = useProfileContext();

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
      <Form
        methods={methods}
        onSubmit={onSubmit && methods.handleSubmit(onSubmit)}
      >
        <Dropdown<UserChallengeProps>
          name={USER_DATA_KEY.COMFORTS}
          label='Tell us about things you are comfortable with'
          showLabel
          placeholder='E.G. Online classes'
          helperText='This will help us create personalised experience for you'
          creatable
          defaultValue={data?.Comforts}
          options={PROFILE_FIELD_OPTIONS.Comforts}
        />
        <Dropdown<UserChallengeProps>
          name={USER_DATA_KEY.STRUGGLES}
          label='Tell us about things that you have struggled with in the past'
          showLabel
          placeholder='E.G. Zoom Meetings'
          helperText='This will help us create personalised experience for you'
          creatable
          defaultValue={data?.Struggles}
          options={PROFILE_FIELD_OPTIONS.Struggles}
        />
        <Dropdown<UserChallengeProps>
          name={USER_DATA_KEY.CHALLENGES}
          label='Tell us about the challenges that you have faced in the past'
          showLabel
          placeholder='E.G. Online Learning'
          helperText='This will help us create personalised experience for you'
          creatable
          defaultValue={data?.Challenges}
          options={PROFILE_FIELD_OPTIONS.Challenges}
        />
        {onSubmit ? <ProfileFormFooter onCancel={onCancel} /> : null}
      </Form>
    );
  }
);

ProfileChallengeForm.displayName = 'ProfileChallengeForm';

export default ProfileChallengeForm;
