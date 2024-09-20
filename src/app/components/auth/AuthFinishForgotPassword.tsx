'use client';

import styles from './auth.module.css';
import { ForgotPasswordFieldValues } from '@/app/interfaces/ForgotPasswordInterface';
import LoaderWrapper from '../loader/LoaderWrapper';
import Form from '@/app/components/formElements/Form';
import TextBox from '@/app/components/formElements/TextBox/TextBox';
import AuthFormHeader from './AuthFormHeader';
import { useForm, UseFormReturn } from 'react-hook-form';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import ActionButton from '../buttons/ActionButton';
import AuthResendOTPBtn from './AuthResendOTPBtn';
import { notifyAxiosError, notifySuccess } from '@/app/utilities/common';
import { useState } from 'react';
import { FinishForgotPasswordProps } from '@/app/interfaces/ForgotPasswordInterface';
import confirmResetPassword from '@/app/utilities/auth/confirmResetPassword';
import Typography, { TypographyVariant } from '../typography/Typography';

const AuthFinishForgotPassword: React.FC<FinishForgotPasswordProps> = ({
  username,
  handleResetDone,
}) => {
  const methods: UseFormReturn<ForgotPasswordFieldValues> =
    useForm<ForgotPasswordFieldValues>({
      mode: 'onBlur',
    });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: ForgotPasswordFieldValues) => {
    const { confirmationCode, newPassword } = data;

    setIsLoading(true);

    try {
      await confirmResetPassword({
        username,
        confirmationCode,
        newPassword,
      });

      notifySuccess('Password successfully reset.');

      handleResetDone();
    } catch (ex) {
      notifyAxiosError(ex);
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
      <AuthFormHeader title='Almost Done' subText='one last step' />
      <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Typography variant={TypographyVariant.Body3}>
          Please enter the verification code sent to <b>{username}</b>.
        </Typography>
        <TextBox
          name='confirmationCode'
          label='Verification Code'
          required
          placeholder='Verification Code'
        />
        <TextBox
          name='newPassword'
          type='password'
          label='New Password'
          required
          placeholder='New Password'
        />
        <TextBox
          name='repeatPassword'
          type='password'
          label='Repeat Password'
          required
          placeholder='Repeat Password'
          autoComplete='new-password'
          rules={{
            validate: (value) => {
              return (
                value == methods.getValues('newPassword') ||
                'Should match the password field'
              );
            },
          }}
        />
        <div className={styles.verifyFormBtnContainer}>
          <ActionButton
            type='submit'
            label='Submit'
            style={BUTTON_STYLE.Primary}
          />
          <AuthResendOTPBtn username={username} resetPasswordCode />
        </div>
      </Form>
    </LoaderWrapper>
  );
};

export default AuthFinishForgotPassword;
