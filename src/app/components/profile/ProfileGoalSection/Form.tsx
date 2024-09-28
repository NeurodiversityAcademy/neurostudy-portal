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
  GOAL_FIELDS,
  PROFILE_FIELD_OPTIONS,
  USER_DATA_KEY,
} from '@/app/utilities/profile/constants';
import ProfileFormFooter from '../ProfileFormFooter';
import Dropdown from '../../formElements/Dropdown/Dropdown';
import { emptyFunc } from '@/app/utilities/common';

type UserGoalProps = UserProps<(typeof GOAL_FIELDS)[number]>;

const ProfileGoalForm: ForwardRefExoticComponent<
  PropsWithoutRef<ProfileSectionFormProps> & RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef, ProfileSectionFormProps>(
  ({ onSubmit, onCancel }, ref) => {
    const { data } = useProfileContext();

    const methods: UseFormReturn<UserGoalProps> = useForm<UserGoalProps>({
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
        onSubmit={onSubmit ? methods.handleSubmit(onSubmit) : emptyFunc}
      >
        <Dropdown<UserGoalProps>
          name={USER_DATA_KEY.GOALS}
          label='Choose any 3 Learning Goals from below'
          showLabel
          placeholder='E.G. Get a Job'
          defaultValue={data?.Goals}
          options={PROFILE_FIELD_OPTIONS.Goals}
          rules={{
            validate: {
              limit3: (value: string[]) =>
                (value?.length || 0) <= 3 || 'Choose at most 3.',
            },
          }}
        />
        <Dropdown<UserGoalProps>
          name={USER_DATA_KEY.INTERESTS}
          label='Choose or Add any 5 topics that interest you'
          showLabel
          placeholder='E.G. Carpentry'
          creatable
          defaultValue={data?.Interests}
          options={PROFILE_FIELD_OPTIONS.Interests}
          rules={{
            validate: {
              limit5: (value: string[]) =>
                (value?.length || 0) <= 5 || 'Choose at most 5.',
            },
          }}
        />
        <Dropdown<UserGoalProps>
          name={USER_DATA_KEY.CONTENTS}
          label='What kind of content would you find most engaging?'
          showLabel
          placeholder='E.G. AR/VR'
          helperText='This will help us create personalised experience for you'
          creatable
          defaultValue={data?.Contents}
          options={PROFILE_FIELD_OPTIONS.Contents}
        />
        {onSubmit ? <ProfileFormFooter onCancel={onCancel} /> : null}
      </Form>
    );
  }
);

ProfileGoalForm.displayName = 'ProfileGoalForm';

export default ProfileGoalForm;
