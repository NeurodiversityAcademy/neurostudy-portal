'use client';

import styles from './auth.module.css';
import ActionButton from '../buttons/ActionButton';
import Link from 'next/link';
import AuthLeftBanner from './AuthLeftBanner';
import AuthFormFooter from './AuthFormFooter';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import TextBox from '@/app/components/formElements/TextBox/TextBox';
import {
  BUTTON_STYLE,
  EMAIL_REGEX,
  TOAST_UNKNOWN_ERROR_MESSAGE,
} from '@/app/utilities/constants';
import classNames from 'classnames';
import Form from '@/app/components/formElements/Form';
import AuthFormHeader from './AuthFormHeader';
import { FORM_STATE } from '@/app/utilities/auth/constants';
import { useRouter } from 'next/navigation';
import { notifyError, notifyInProgress } from '@/app/utilities/common';
import LoaderWrapper from '../loader/LoaderWrapper';
import { useState } from 'react';
import AuthVerifyForm from './AuthVerifyForm';
import { signIn } from 'next-auth/react';
import { SignInOutput } from 'aws-amplify/auth';
import useAuthError from '@/app/hooks/useAuthError';
import { getCallbackUrlOnSignIn } from '@/app/utilities/auth/helper';

interface LoginFieldValues extends FieldValues {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const methods: UseFormReturn<LoginFieldValues> = useForm<LoginFieldValues>({
    mode: 'onBlur',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formState, setFormState] = useState<FORM_STATE>(
    FORM_STATE.INITIALIZED
  );

  const isConfirming = formState === FORM_STATE.CONFIRM_SIGN_UP;

  useAuthError();

  const onSubmit = async (data: LoginFieldValues) => {
    const { username, password } = data;

    setIsLoading(true);

    try {
      const res = await signIn(
        'credentials',
        {
          username,
          password,
          redirect: false,
        },
        { method: 'signIn' }
      );

      if (!res) {
        return;
      }

      if (!res.ok && !res.error) {
        throw new Error(TOAST_UNKNOWN_ERROR_MESSAGE);
      }

      if (res.ok) {
        // TODO
        // https://trello.com/c/suoF46yg/131-infrastructure-key-constant-based-url-setup
        router.replace(getCallbackUrlOnSignIn());
      } else if (res?.error) {
        try {
          const signInOutput: SignInOutput = JSON.parse(res.error);
          const { signInStep } = signInOutput.nextStep;
          if (signInStep === FORM_STATE.CONFIRM_SIGN_UP) {
            setUsername(username);
            setPassword(password);
            setFormState(signInStep as FORM_STATE);
          } else {
            notifyInProgress();
          }
        } catch (ex) {
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
    <main className={styles.container}>
      <div className='row'>
        <AuthLeftBanner />
        <div className={classNames(styles.formColumn, 'col-md-8')}>
          <LoaderWrapper
            isLoading={isLoading}
            className={styles.formColumnWrapper}
            expandLoaderWidth
          >
            <AuthFormHeader title='Login' subText='to your account' />
            {isConfirming && (
              <AuthVerifyForm
                username={username}
                password={password}
                setIsLoading={setIsLoading}
                onSuccess={() => router.replace(getCallbackUrlOnSignIn())}
                onIncorrectCredentials={() =>
                  setFormState(FORM_STATE.INITIALIZED)
                }
              />
            )}
            <Form
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
              className={classNames(isConfirming && 'hide')}
            >
              <TextBox
                name='username'
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
              />
              <div className={styles.forgotPassword}>
                <Link href='/forgotpassword'>Forgot Password?</Link>
              </div>
              <div className='mb-3'>
                <ActionButton
                  type='submit'
                  label='Login'
                  style={BUTTON_STYLE.Primary}
                  fullWidth
                />
              </div>
            </Form>
            <AuthFormFooter
              text='New to Neurodiversity Academy? '
              to='/signup'
              toText='Sign Up'
            />
          </LoaderWrapper>
        </div>
      </div>
    </main>
  );
};

export default Login;
