'use client';

import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';
import styles from '../page.module.css';
import commonStyles from '@/app/styles/common.module.css';
import Form from '@/app/components/formElements/Form';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import TextBox from '@/app/components/formElements/TextBox';
import { BUTTON_STYLE, EMAIL_REGEX } from '@/app/utilities/constants';
import classNames from 'classnames';
import Link from 'next/link';
import ActionButton from '@/app/components/buttons/ActionButton';
import AuthFormHeader from './AuthFormHeader';
import AuthFormFooter from './AuthFormFooter';

interface SignUpFieldValues extends FieldValues {
  email: string;
  password: string;
  repeatPassword: string;
}

const AuthInitSignUp: React.FC = () => {
  const { control }: UseFormReturn<SignUpFieldValues> =
    useForm<SignUpFieldValues>({ mode: 'onBlur' });

  return (
    <>
      <AuthFormHeader />
      <Form control={control}>
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
        />
        <Typography
          variant={TypographyVariant.Body2}
          className={classNames('pt-3 pb-2', commonStyles.textCenter)}
        >
          By signing up, you agree to our{' '}
          <Link href='#'>Terms and Conditions</Link>
        </Typography>
        <div>
          <ActionButton
            type='submit'
            label='Sign Up'
            disabled
            className={classNames(styles.btn, styles.submitBtn, 'mt-0')}
            style={BUTTON_STYLE.PrimaryFull}
          />
        </div>
      </Form>
      <AuthFormFooter />
    </>
  );
};

export default AuthInitSignUp;
