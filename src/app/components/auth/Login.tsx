'use client';

import styles from './auth.module.css';
import commonStyles from '@/app/styles/common.module.css';
import ActionButton from '../buttons/ActionButton';
import Link from 'next/link';
import AuthLeftBanner from './AuthLeftBanner';
import AuthFormFooter from './AuthFormFooter';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import TextBox from '@/app/components/formElements/TextBox';
import {
  BUTTON_STYLE,
  EMAIL_REGEX,
  TOAST_DEV_IN_PROGRESS_MESSAGE,
} from '@/app/utilities/constants';
import classNames from 'classnames';
import Form from '@/app/components/formElements/Form';
import AuthFormHeader from './AuthFormHeader';
import { signIn } from 'aws-amplify/auth';
import toast from 'react-hot-toast';
import { FORM_STATE } from '@/app/utilities/auth/constants';
import { useRouter } from 'next/navigation';
import { notifyError } from '@/app/utilities/common';
import LoaderWrapper from '../loader/LoaderWrapper';
import { useState } from 'react';
import AuthVerifyForm from './AuthVerifyForm';

interface LoginFieldValues extends FieldValues {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const { control, handleSubmit }: UseFormReturn<LoginFieldValues> =
    useForm<LoginFieldValues>({ mode: 'onBlur' });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [formState, setFormState] = useState<FORM_STATE>(
    FORM_STATE.INITIALIZED
  );

  const isConfirming = formState === FORM_STATE.CONFIRM_SIGN_UP;

  const onSubmit = async (data: LoginFieldValues) => {
    const { username, password } = data;

    setIsLoading(true);

    try {
      const {
        nextStep: { signInStep },
      } = await signIn({ username, password });

      if (signInStep === FORM_STATE.DONE) {
        // TODO
        // https://trello.com/c/suoF46yg/131-infrastructure-key-constant-based-url-setup
        router.replace(isConfirming ? '/signup' : '/');
      } else if (signInStep === FORM_STATE.CONFIRM_SIGN_UP) {
        setUsername(username);
        setFormState(signInStep as FORM_STATE);
      } else {
        toast(TOAST_DEV_IN_PROGRESS_MESSAGE);
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
                setIsLoading={setIsLoading}
                onSuccess={handleSubmit(onSubmit)}
              />
            )}
            <Form
              control={control}
              onSubmit={handleSubmit(onSubmit)}
              className={classNames(isConfirming && commonStyles.hide)}
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
              <div className={classNames(styles.forgotPassword, 'pt-1')}>
                <Link href='#'>Forgot Password?</Link>
              </div>
              <div className='my-3'>
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
