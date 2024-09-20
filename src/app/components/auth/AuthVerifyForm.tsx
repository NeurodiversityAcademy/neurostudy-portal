'use client';

import styles from './auth.module.css';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import Form from '../formElements/Form';
import Typography, { TypographyVariant } from '../typography/Typography';
import ActionButton from '../buttons/ActionButton';
import {
  BUTTON_STYLE,
  TOAST_UNKNOWN_ERROR_MESSAGE,
} from '@/app/utilities/constants';
import { notifyError, notifyInProgress } from '@/app/utilities/common';
import TextBox from '../formElements/TextBox/TextBox';
import AuthResendOTPBtn from './AuthResendOTPBtn';
import { signIn } from 'next-auth/react';
import { INVALID_CREDENTIALS_MESSAGE } from '@/app/utilities/auth/constants';
import classNames from 'classnames';

interface PropType {
  username: string;
  password: string;
  setIsLoading: (isLoading: boolean) => void;
  onSuccess?: () => void;
  onIncorrectCredentials?: () => void;
}

interface VerificationFieldValues extends FieldValues {
  code: string;
}

const AuthVerifyForm: React.FC<PropType> = ({
  username,
  password,
  setIsLoading,
  onSuccess,
  onIncorrectCredentials,
}: PropType) => {
  const methods: UseFormReturn<VerificationFieldValues> =
    useForm<VerificationFieldValues>({ mode: 'onBlur' });

  const onSubmit = async (data: VerificationFieldValues) => {
    const { confirmationCode } = data;

    setIsLoading(true);

    try {
      const res = await signIn(
        'credentials',
        {
          username,
          password,
          confirmationCode,
          redirect: false,
        },
        { method: 'confirmSignUp' }
      );

      if (!res) {
        return;
      }

      if (!res.ok && !res.error) {
        throw new Error(TOAST_UNKNOWN_ERROR_MESSAGE);
      }

      if (res.ok) {
        onSuccess?.();
      } else if (res?.error) {
        try {
          // NOTE
          // If it's JSON-parseable, it means aws-amplify API processed it
          // properly, but we don't have means to handle those at this moment
          if (JSON.parse(res.error)) {
            notifyInProgress();
          } else {
            throw new Error(TOAST_UNKNOWN_ERROR_MESSAGE);
          }
        } catch (ex) {
          res.error === INVALID_CREDENTIALS_MESSAGE &&
            onIncorrectCredentials?.();

          throw new Error(res.error);
        }
      }
    } catch (ex) {
      notifyError(ex as object);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      <div className={classNames(styles.verifyFormBtnContainer, 'mt-2 mb-3')}>
        <ActionButton
          type='submit'
          label='Verify'
          style={BUTTON_STYLE.Primary}
        />
        <AuthResendOTPBtn username={username} />
      </div>
    </Form>
  );
};

export default AuthVerifyForm;
