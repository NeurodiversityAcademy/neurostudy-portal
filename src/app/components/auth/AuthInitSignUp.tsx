'use client';

import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';
import styles from './auth.module.css';
import Form from '@/app/components/formElements/Form';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import TextBox from '@/app/components/formElements/TextBox/TextBox';
import { BUTTON_STYLE, EMAIL_REGEX } from '@/app/utilities/constants';
import classNames from 'classnames';
import Link from 'next/link';
import ActionButton from '@/app/components/buttons/ActionButton';
import AuthFormHeader from './AuthFormHeader';
import AuthFormFooter from './AuthFormFooter';
import { SignUpOutput } from 'aws-amplify/auth';
import { FORM_STATE } from '@/app/utilities/auth/constants';
import { useState } from 'react';
import LoaderWrapper from '../loader/LoaderWrapper';
import {
  getAxiosErrorMessage,
  notifyError,
  notifyInProgress,
} from '@/app/utilities/common';
import AuthVerifyForm from './AuthVerifyForm';
import signUp from '@/app/utilities/auth/signUp';

interface SignUpFieldValues extends FieldValues {
  email: string;
  password: string;
  repeatPassword: string;
}

const AuthInitSignUp: React.FC = () => {
  const methods: UseFormReturn<SignUpFieldValues> = useForm<SignUpFieldValues>({
    mode: 'onBlur',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<FORM_STATE>(
    FORM_STATE.INITIALIZED
  );
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSubmit = async (data: SignUpFieldValues) => {
    const { email, password } = data;

    setUsername('');
    setPassword('');
    setIsLoading(true);

    try {
      const { nextStep }: SignUpOutput = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      const { signUpStep } = nextStep;

      if (signUpStep === FORM_STATE.CONFIRM_SIGN_UP) {
        setUsername(email);
        setPassword(password);
        setFormState(signUpStep as FORM_STATE);
      } else {
        notifyInProgress();
      }
    } catch (ex) {
      notifyError(getAxiosErrorMessage(ex as object));
    } finally {
      setIsLoading(false);
    }
  };

  const isConfirming = formState === FORM_STATE.CONFIRM_SIGN_UP;

  return (
    <LoaderWrapper
      isLoading={isLoading}
      className={styles.formColumnWrapper}
      expandLoaderWidth
    >
      <AuthFormHeader />
      {isConfirming && (
        <AuthVerifyForm
          username={username}
          password={password}
          setIsLoading={setIsLoading}
        />
      )}
      <Form
        methods={methods}
        onSubmit={methods.handleSubmit(onSubmit)}
        className={classNames(isConfirming && 'hide')}
      >
        <TextBox
          name='email'
          type='email'
          label='Email Address'
          required
          placeholder='Email address'
          pattern={EMAIL_REGEX}
        />
        <TextBox
          name='password'
          type='password'
          label='Password'
          required
          placeholder='Password'
          autoComplete='new-password'
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
                value == methods.getValues('password') ||
                'Should match the password field'
              );
            },
          }}
        />
        <Typography
          variant={TypographyVariant.Body2}
          className='pt-2 text-center'
        >
          By signing up, you agree to our{' '}
          <Link href='#'>Terms and Conditions</Link>
        </Typography>
        <div className='mt-2 mb-3'>
          <ActionButton
            type='submit'
            label='Sign Up'
            style={BUTTON_STYLE.Primary}
            fullWidth
          />
        </div>
      </Form>
      <AuthFormFooter
        text='Already have an account? '
        toText='Login'
        to='/login'
      />
    </LoaderWrapper>
  );
};

export default AuthInitSignUp;
