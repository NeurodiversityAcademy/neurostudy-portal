'use client';

import styles from './auth.module.css';
import { ForgotPasswordFieldValues } from '@/app/interfaces/ForgotPasswordInterface';
import { FORM_STATE } from '@/app/utilities/auth/constants';
import { ResetPasswordOutput } from 'aws-amplify/auth';
import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '@/app/components/formElements/Form';
import TextBox from '@/app/components/formElements/TextBox/TextBox';
import LoaderWrapper from '../loader/LoaderWrapper';
import AuthFormHeader from './AuthFormHeader';
import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE, EMAIL_REGEX } from '@/app/utilities/constants';
import {
  getAxiosErrorMessage,
  notifyError,
  notifyInProgress,
} from '@/app/utilities/common';
import AuthFormFooter from './AuthFormFooter';
import { InitForgotPasswordProps } from '@/app/interfaces/ForgotPasswordInterface';
import resetPassword from '@/app/utilities/auth/resetPassword';

const AuthInitForgotPassword: React.FC<InitForgotPasswordProps> = ({
  handleVerificationCode,
}) => {
  const methods: UseFormReturn<ForgotPasswordFieldValues> =
    useForm<ForgotPasswordFieldValues>({
      mode: 'onBlur',
    });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: ForgotPasswordFieldValues) => {
    const { username } = data;

    setIsLoading(true);

    try {
      const output: ResetPasswordOutput = await resetPassword({ username });

      const {
        nextStep: { resetPasswordStep },
      } = output;
      switch (resetPasswordStep) {
        case FORM_STATE.CONFIRM_RESET_PASSWORD_WITH_CODE:
          handleVerificationCode(username);
          break;
        default:
          notifyInProgress();
          break;
      }
    } catch (ex) {
      notifyError(getAxiosErrorMessage(ex as object));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoaderWrapper
      isLoading={isLoading}
      className={styles.formColumnWrapper}
      expandLoaderWidth
    >
      <AuthFormHeader title='Forgot Password?' subText='Reset your password' />
      <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <TextBox
          name='username'
          type='email'
          label='Email Address'
          required
          placeholder='Email address'
          pattern={EMAIL_REGEX}
        />
        <div className='mt-2 mb-3'>
          <ActionButton
            type='submit'
            label='Send Code'
            style={BUTTON_STYLE.Primary}
            fullWidth
          />
        </div>
      </Form>
      <AuthFormFooter />
    </LoaderWrapper>
  );
};

export default AuthInitForgotPassword;
