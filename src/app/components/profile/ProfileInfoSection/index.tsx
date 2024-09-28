'use client';

import {
  EMAIL_REGEX,
  FORM_ELEMENT_COL_WIDTH,
  NAME_REGEX,
} from '@/app/utilities/constants';
import Form from '../../formElements/Form';
import TextBox from '../../formElements/TextBox/TextBox';
import { useForm, UseFormReturn } from 'react-hook-form';
import { notifyInProgress } from '@/app/utilities/common';
import ProfileCard from '../ProfileCard';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import { UserProps } from '@/app/interfaces/User';
import {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useImperativeHandle,
} from 'react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';
import { USER_DATA_KEY } from '@/app/utilities/profile/constants';

const ProfileInfoSection: ForwardRefExoticComponent<
  RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef>((_, ref) => {
  const { data, isLoading } = useProfileContext();

  const methods: UseFormReturn<UserProps> = useForm<UserProps>({
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
    <ProfileCard title='Personal Information' isLoading={isLoading}>
      <Form
        methods={methods}
        onSubmit={methods.handleSubmit(() => {
          notifyInProgress();
        })}
      >
        <TextBox<UserProps>
          name={USER_DATA_KEY.FIRST_NAME}
          label='First Name'
          required
          placeholder='First Name'
          pattern={NAME_REGEX}
          showLabel
          defaultValue={data?.FirstName}
          cols={FORM_ELEMENT_COL_WIDTH.HALF}
        />
        <TextBox<UserProps>
          name={USER_DATA_KEY.LAST_NAME}
          label='Last Name'
          required
          placeholder='Last Name'
          pattern={NAME_REGEX}
          showLabel
          defaultValue={data?.LastName}
          cols={FORM_ELEMENT_COL_WIDTH.HALF}
        />
        <TextBox<UserProps>
          type='number'
          name={USER_DATA_KEY.AGE}
          label='Age'
          required
          placeholder='Age'
          showLabel
          defaultValue={data?.Age}
          rules={{
            validate: (_value: number) => {
              const value = parseFloat(_value?.toString() || '');

              if (isNaN(value)) {
                return '"Number" type expected.';
              }

              return value > 0 || 'Value should be greater than 0.';
            },
          }}
        />
        {/* Note: 'Email' is not actually a part of the accepted field values. */}
        {/* - 'Email' is not actually a part of the accepted field values. */}
        {/* - Which is why we aren't enforcing `<TextBox<UserProps> />` */}
        {/* - This will eventually be ignored during/before submission. */}
        <TextBox
          name='Email'
          label='Email Address'
          required
          placeholder='Email Address'
          pattern={EMAIL_REGEX}
          showLabel
          defaultValue={data?.Email}
          disabled
        />
      </Form>
    </ProfileCard>
  );
});

ProfileInfoSection.displayName = 'ProfileInfoSection';

export default ProfileInfoSection;
