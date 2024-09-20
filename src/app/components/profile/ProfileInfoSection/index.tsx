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

const ProfileInfoSection: React.FC = () => {
  const { data, isLoading } = useProfileContext();

  const methods: UseFormReturn = useForm({
    mode: 'onBlur',
  });

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
          // TODO
          defaultValue=''
        />
        <TextBox
          name='Email'
          label='Email Address'
          required
          placeholder='Email Address'
          pattern={EMAIL_REGEX}
          showLabel
          defaultValue={data?.Email || ''}
        />
      </Form>
    </ProfileCard>
  );
};

export default ProfileInfoSection;
