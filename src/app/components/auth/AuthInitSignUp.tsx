'use client';

import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';
import styles from './auth.module.css';
import commonStyles from '@/app/styles/common.module.css';
import Form from '@/app/components/formElements/Form';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import TextBox from '@/app/components/formElements/TextBox/TextBox';
import {
  BUTTON_STYLE,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  TOAST_DEV_IN_PROGRESS_MESSAGE,
} from '@/app/utilities/constants';
import classNames from 'classnames';
import Link from 'next/link';
import ActionButton from '@/app/components/buttons/ActionButton';
import AuthFormHeader from './AuthFormHeader';
import AuthFormFooter from './AuthFormFooter';
import { SignUpOutput, signUp } from 'aws-amplify/auth';
import { FORM_STATE } from '@/app/utilities/auth/constants';
import LoaderWrapper from '../loader/LoaderWrapper';
import toast from 'react-hot-toast';
import { notifyError } from '@/app/utilities/common';
import AuthVerifyForm from './AuthVerifyForm';
import { useAppSelector } from '@/app/redux/store';
import { useDispatch } from 'react-redux';
import {
  setFormState,
  setUsername,
} from '@/app/redux/features/form/form-slice';
import { setIsLoading } from '@/app/redux/features/loader/loader-slice';

interface SignUpFieldValues extends FieldValues {
  email: string;
  password: string;
  repeatPassword: string;
}

const AuthInitSignUp: React.FC = () => {
  const methods: UseFormReturn<SignUpFieldValues> = useForm<SignUpFieldValues>({
    mode: 'onBlur',
  });

  const isLoading = useAppSelector((state) => state.loaderReducer.isLoading);
  const formState = useAppSelector((state) => state.formReducer.formState);
  const username = useAppSelector((state) => state.formReducer.username);
  const dispatch = useDispatch();

  function setDispatchLoading(isDisptachLoading: boolean): void {
    dispatch(setIsLoading(isDisptachLoading));
  }

  const onSubmit = async (data: SignUpFieldValues) => {
    const { email, password } = data;

    dispatch(setUsername(''));
    setDispatchLoading(true);

    try {
      const { nextStep }: SignUpOutput = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true,
        },
      });

      const { signUpStep } = nextStep;

      if (signUpStep === FORM_STATE.CONFIRM_SIGN_UP) {
        dispatch(setUsername(email));
        dispatch(setFormState(signUpStep as FORM_STATE));
      } else {
        toast(TOAST_DEV_IN_PROGRESS_MESSAGE);
      }
    } catch (ex) {
      notifyError(ex as object);
    } finally {
      setDispatchLoading(false);
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
          username={username ?? ''}
          setIsLoading={setDispatchLoading}
        />
      )}
      <Form
        methods={methods}
        onSubmit={methods.handleSubmit(onSubmit)}
        className={classNames(isConfirming && commonStyles.hide)}
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
          pattern={PASSWORD_REGEX}
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
                value == methods.control._formValues.password ||
                'Should match the password field'
              );
            },
          }}
        />
        <Typography
          variant={TypographyVariant.Body2}
          className={classNames('pt-3', commonStyles.textCenter)}
        >
          By signing up, you agree to our{' '}
          <Link href='#'>Terms and Conditions</Link>
        </Typography>
        <div className='my-3'>
          <ActionButton
            type='submit'
            label='Sign Up'
            style={BUTTON_STYLE.Primary}
            fullWidth
          />
        </div>
      </Form>
      <AuthFormFooter />
    </LoaderWrapper>
  );
};

export default AuthInitSignUp;
