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
        initialized={!isLoading}
        methods={methods}
        onSubmit={methods.handleSubmit(() => {
          notifyInProgress();
        })}
      >
        <TextBox
          name='FirstName'
          label='First Name'
          required
          placeholder='First Name'
          pattern={NAME_REGEX}
          showLabel
          defaultValue={data?.FirstName || ''}
          colWidth={FORM_ELEMENT_COL_WIDTH.HALF}
        />
        <TextBox
          name='LastName'
          label='Last Name'
          required
          placeholder='Last Name'
          pattern={NAME_REGEX}
          showLabel
          defaultValue={data?.LastName || ''}
          colWidth={FORM_ELEMENT_COL_WIDTH.HALF}
        />
        <TextBox
          type='number'
          name='Age'
          label='Age'
          required
          placeholder='Age'
          showLabel
          defaultValue={data?.Age || ''}
          rules={{
            validate: (_value) => {
              const value = parseFloat(_value);

              if (isNaN(value)) {
                return '"Number" type expected.';
              }

              return value > 0 || 'Value should be greater than 0.';
            },
          }}
        />
        {/* // TODO */}
        {/* 'Email' is not actually a part of the accepted field values. */}
        {/* We need to apply strict typing and make sure no unacceptable field values */}
        {/* passes the system. The applied strategy needs to be convenient. */}
        <TextBox
          name='Email'
          label='Email Address'
          required
          placeholder='Email Address'
          pattern={EMAIL_REGEX}
          showLabel
          defaultValue={data?.Email || ''}
          disabled
        />
      </Form>
    </ProfileCard>
  );
});

ProfileInfoSection.displayName = 'ProfileInfoSection';

export default ProfileInfoSection;
