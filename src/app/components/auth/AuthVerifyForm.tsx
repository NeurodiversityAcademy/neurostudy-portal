'use client';

import styles from './auth.module.css';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import Form from '../formElements/Form';
import Typography, { TypographyVariant } from '../typography/Typography';
import ActionButton from '../buttons/ActionButton';
import {
  BUTTON_STYLE,
  TOAST_DEV_IN_PROGRESS_MESSAGE,
} from '@/app/utilities/constants';
import { FORM_STATE } from '@/app/utilities/auth/constants';
import { SignUpOutput, autoSignIn, confirmSignUp } from 'aws-amplify/auth';
import { notifyError } from '@/app/utilities/common';
import TextBox from '../formElements/TextBox';
import toast from 'react-hot-toast';

interface PropType {
  username: string;
  setIsLoading: (isLoading: boolean) => void;
  onSuccess?: () => void;
}

interface VerificationFieldValues extends FieldValues {
  code: string;
}

const AuthVerifyForm: React.FC<PropType> = ({
  username,
  setIsLoading,
  onSuccess,
}: PropType) => {
  const { control, handleSubmit }: UseFormReturn<VerificationFieldValues> =
    useForm<VerificationFieldValues>({ mode: 'onBlur' });

  const onSubmit = async (data: VerificationFieldValues) => {
    const { confirmationCode } = data;

    setIsLoading(true);

    try {
      const { nextStep }: SignUpOutput = await confirmSignUp({
        username,
        confirmationCode,
      });

      const signUpStep = nextStep.signUpStep as FORM_STATE;

      if (signUpStep === FORM_STATE.COMPLETE_AUTO_SIGN_IN) {
        await autoSignIn();
      } else if (signUpStep !== FORM_STATE.DONE) {
        toast(TOAST_DEV_IN_PROGRESS_MESSAGE);
      }

      if (
        onSuccess &&
        [FORM_STATE.COMPLETE_AUTO_SIGN_IN, FORM_STATE.DONE].includes(signUpStep)
      ) {
        onSuccess();
      }
    } catch (ex) {
      notifyError(ex as object);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form control={control} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant={TypographyVariant.Body3} className='pt-3'>
        Please enter the verification code sent to <b>{username}</b>.
      </Typography>
      <TextBox
        name='confirmationCode'
        label='Verification Code'
        required
        placeholder='Verification Code'
      />
      <div className={styles.verifyBtnContainer}>
        <ActionButton
          type='submit'
          label='Verify'
          style={BUTTON_STYLE.Primary}
        />
      </div>
    </Form>
  );
};

export default AuthVerifyForm;
