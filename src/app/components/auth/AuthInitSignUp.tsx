'use client';

import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';
import styles from './auth.module.css';
import Form from '@/app/components/formElements/Form';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import TextBox from '@/app/components/formElements/TextBox/TextBox';
import {
  BUTTON_STYLE,
  EMAIL_REGEX,
  FORM_ELEMENT_COL_WIDTH,
} from '@/app/utilities/constants';
import classNames from 'classnames';
import Link from 'next/link';
import ActionButton from '@/app/components/buttons/ActionButton';
import AuthFormHeader from './AuthFormHeader';
import AuthFormFooter from './AuthFormFooter';
import { SignUpOutput } from 'aws-amplify/auth';
import {
  FORM_STATE,
  OPTIONS_DATE,
  OPTIONS_MONTH,
  OPTIONS_YEAR,
} from '@/app/utilities/auth/constants';
import { useState } from 'react';
import LoaderWrapper from '../loader/LoaderWrapper';
import { notifyAxiosError, notifyInProgress } from '@/app/utilities/common';
import AuthVerifyForm from './AuthVerifyForm';
import signUp from '@/app/utilities/auth/signUp';
import { useSearchParams } from 'next/navigation';
import Dropdown from '../formElements/Dropdown/Dropdown';

interface SignUpFieldValues extends FieldValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  date: number;
  month: number;
  year: number;
}

const AuthInitSignUp: React.FC = () => {
  const searchParams = useSearchParams();
  const readOnlyEmail = searchParams.get('email');
  const isEmailReadOnly = !!readOnlyEmail;

  const methods: UseFormReturn<SignUpFieldValues> = useForm<SignUpFieldValues>({
    mode: 'onBlur',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<FORM_STATE>(
    FORM_STATE.INITIALIZED
  );
  const [username, setUsername] = useState<string>(readOnlyEmail || '');
  const [password, setPassword] = useState<string>('');

  const onSubmit = async (data: SignUpFieldValues) => {
    const { firstName, lastName, email, password, date, month, year } = data;

    const dob = new Date(year, month, date).toISOString().split('T')[0];

    setIsLoading(true);

    try {
      const { nextStep }: SignUpOutput = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
            birthdate: dob,
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
      notifyAxiosError(ex);
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
        className={classNames('row', { hide: isConfirming })}
      >
        <TextBox
          name='firstName'
          label='First Name'
          required
          placeholder='First Name'
          cols={FORM_ELEMENT_COL_WIDTH.HALF}
        />
        <TextBox
          name='lastName'
          label='Last Name'
          required
          placeholder='Last Name'
          cols={FORM_ELEMENT_COL_WIDTH.HALF}
        />
        <TextBox
          name='email'
          type='email'
          label='Email Address'
          required
          placeholder='Email address'
          pattern={EMAIL_REGEX}
          defaultValue={username}
          readOnly={isEmailReadOnly}
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
          variant={TypographyVariant.Body3}
          className={classNames(styles.dobLabel, 'col-md-12', 'pt-2')}
        >
          Date of Birth
        </Typography>
        <Dropdown
          name='date'
          label='Date'
          placeholder='Date'
          cols={FORM_ELEMENT_COL_WIDTH.SMALL}
          options={OPTIONS_DATE}
        />
        <Dropdown
          name='month'
          label='Month'
          placeholder='Month'
          cols={FORM_ELEMENT_COL_WIDTH.SMALL}
          options={OPTIONS_MONTH}
        />
        <Dropdown
          name='year'
          label='Year'
          placeholder='Year'
          cols={FORM_ELEMENT_COL_WIDTH.SMALL}
          options={OPTIONS_YEAR}
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
