'use client';

import React from 'react';
import Image from 'next/image';
import { BUTTON_STYLE, EMAIL_REGEX } from '@/app/utilities/constants';
import styles from './handbookPopup.module.css';
import Dialog from '../dialog';
import ActionButton from '../buttons/ActionButton';
import Form from '@/app/components/formElements/Form';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import TextBox from '../formElements/TextBox/TextBox';
import Loader from '../loader/Loader';
import mailBoxLadySrc from '@/app/images/mailboxLady.png';
import Typography, { TypographyVariant } from '../typography/Typography';

interface HandbookPopupProps {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
}

interface HandbookSubscribeFieldValues extends FieldValues {
  email: string;
}

export default function HandbookPopup({
  open,
  isLoading,
  onClose,
}: HandbookPopupProps) {
  const methods: UseFormReturn<HandbookSubscribeFieldValues> =
    useForm<HandbookSubscribeFieldValues>({ mode: 'onBlur' });

  const onSubmit = async (data: HandbookSubscribeFieldValues) => {
    console.log('data', data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className={styles.container}>
        <Image
          src={mailBoxLadySrc}
          alt='Subscribe to our Newsletter'
          className={styles.mailBoxImg}
          quality={100}
        />
        <Form
          methods={methods}
          onSubmit={methods.handleSubmit(onSubmit)}
          className={styles.form}
        >
          <Typography variant={TypographyVariant.H3} className='m-0'>
            Subscribe to our Newsletter!
          </Typography>
          <Typography variant={TypographyVariant.Body3} className='mb-3'>
            Register your email address to get free access to the handbook.
          </Typography>
          <TextBox
            name='email'
            type='email'
            label='Email Address'
            required
            placeholder='Email address'
            pattern={EMAIL_REGEX}
          />
          <div>
            <ActionButton
              type='submit'
              label='Free Download'
              style={BUTTON_STYLE.Primary}
              fullWidth
            />
          </div>
          <Loader isLoading={isLoading} />
        </Form>
      </div>
    </Dialog>
  );
}
