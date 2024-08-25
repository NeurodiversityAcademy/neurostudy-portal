'use client';

import {
  EMAIL_REGEX,
  FORM_ELEMENT_COL_WIDTH,
  NAME_REGEX,
} from '@/app/utilities/constants';
import Form from '../formElements/Form';
import TextBox from '../formElements/TextBox/TextBox';
import { useForm, UseFormReturn } from 'react-hook-form';
import { notifyInProgress } from '@/app/utilities/common';

interface Props {
  user: Record<string, string | number>;
}

const ProfileInfoSection: React.FC<Props> = ({ user }) => {
  const methods: UseFormReturn = useForm({
    mode: 'onBlur',
  });

  return (
    <Form
      methods={methods}
      onSubmit={methods.handleSubmit(() => {
        notifyInProgress();
      })}
    >
      <TextBox
        name='firstname'
        label='First Name'
        required
        placeholder='First Name'
        pattern={NAME_REGEX}
        showLabel
        defaultValue={user.firstName}
        colWidth={FORM_ELEMENT_COL_WIDTH.HALF}
      />
      <TextBox
        name='lastname'
        label='Last Name'
        required
        placeholder='Last Name'
        pattern={NAME_REGEX}
        showLabel
        defaultValue={user.lastName}
        colWidth={FORM_ELEMENT_COL_WIDTH.HALF}
      />
      <TextBox
        type='number'
        name='age'
        label='Age'
        required
        placeholder='Age'
        showLabel
        defaultValue={user.age}
      />
      <TextBox
        name='email'
        label='Email Address'
        required
        placeholder='Email Address'
        pattern={EMAIL_REGEX}
        showLabel
        defaultValue={user.email}
      />
    </Form>
  );
};

export default ProfileInfoSection;
