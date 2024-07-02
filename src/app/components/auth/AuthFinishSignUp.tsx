'use client';

import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';
import styles from './auth.module.css';
import Form from '@/app/components/formElements/Form';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import TextBox from '@/app/components/formElements/TextBox/TextBox';
import classNames from 'classnames';
import ActionButton from '@/app/components/buttons/ActionButton';
import {
  BUTTON_STYLE,
  FORM_ELEMENT_COL_WIDTH,
} from '@/app/utilities/constants';
import AuthFormHeader from './AuthFormHeader';

interface SignUpFieldValues extends FieldValues {
  firstName: string;
  lastName: string;
  date: number;
  month: number;
  year: number;
}

const AuthFinishSignUp: React.FC = () => {
  const methods: UseFormReturn<SignUpFieldValues> = useForm<SignUpFieldValues>({
    mode: 'onBlur',
  });

  return (
    <div className={styles.formColumnWrapper}>
      <AuthFormHeader title='Almost Done' subText='one last step' />
      <Form methods={methods}>
        <TextBox
          name='firstName'
          label='First Name'
          required
          placeholder='First Name'
          colWidth={FORM_ELEMENT_COL_WIDTH.HALF}
        />
        <TextBox
          name='lastName'
          label='Last Name'
          required
          placeholder='Last Name'
          colWidth={FORM_ELEMENT_COL_WIDTH.HALF}
        />
        <Typography
          variant={TypographyVariant.Body3}
          className={classNames(styles.dobLabel, 'col-md-12', 'pt-2')}
        >
          Date of Birth
        </Typography>
        <div className='col-md-12'>
          <div className={classNames(styles.dobInputContainer, 'row')}>
            <TextBox
              name='date'
              type='number'
              label='Date'
              required
              placeholder='Date'
            />
            <TextBox
              name='month'
              type='number'
              label='Month'
              required
              placeholder='Month'
            />
            <TextBox
              name='year'
              type='number'
              label='Year'
              required
              placeholder='Year'
            />
          </div>
        </div>
        <div className='my-3'>
          <ActionButton
            type='submit'
            label='Submit'
            disabled
            style={BUTTON_STYLE.Primary}
            fullWidth
          />
        </div>
      </Form>
    </div>
  );
};

export default AuthFinishSignUp;
