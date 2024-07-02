'use client';
import React, { useState } from 'react';
import TextBox from '@/app/components/formElements/TextBox/TextBox';
import ActionButton from '../buttons/ActionButton';
import CRMCreateResponseInterface from '@/app/interfaces/CRMCreateResponseInterface';
import { UserSubscriptionType } from '@/app/interfaces/UserSubscriptionType';
import { registerSubscriptionData } from '@/app/utilities/register/registerSubscriptionData';
import { BUTTON_STYLE, EMAIL_REGEX } from '@/app/utilities/constants';
import Image from 'next/image';
import styles from './subscribe.module.css';
import MailboxLady from '../../images/mailboxLady.png';
import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import Form from '@/app/components/formElements/Form';
import { notifyError } from '@/app/utilities/common';
import LoaderWrapper from '../loader/LoaderWrapper';

interface SubscribeFieldValues extends FieldValues {
  email: string;
}

export default function Subscribe() {
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const methods: UseFormReturn<SubscribeFieldValues> =
    useForm<SubscribeFieldValues>({ mode: 'onBlur' });

  const onSubmit = async (data: SubscribeFieldValues) => {
    const userSubscriptionData: UserSubscriptionType = {
      email: data.email,
    };

    setIsLoading(true);

    try {
      const outcome: CRMCreateResponseInterface =
        await registerSubscriptionData(userSubscriptionData);

      if (outcome.id || !outcome) {
        setSubmissionSuccess(true);
      }
    } catch (error) {
      notifyError(error as object);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            src={MailboxLady}
            alt='Subscribe to our Newsletter'
            title='Subscribe to out Newsletter'
            fill={true}
            quality={100}
          />
        </div>
        <LoaderWrapper
          isLoading={isLoading}
          className={styles.contentWrapper}
          expandLoaderWidth
        >
          {!submissionSuccess ? (
            <>
              <p className={styles.title}>Subscribe to our Newsletter!</p>
              <p className={styles.description}>
                Be the first to get exclusive offers and latest news
              </p>
              <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                <TextBox
                  name='email'
                  type='email'
                  label='Email Address'
                  required
                  placeholder='Email address'
                  pattern={EMAIL_REGEX}
                />
                <div className='mt-2'>
                  <ActionButton
                    type='submit'
                    label='Subscribe Now'
                    style={BUTTON_STYLE.Primary}
                    fullWidth
                  />
                </div>
              </Form>
            </>
          ) : (
            <>
              <p className={styles.successTitle}>
                <Typography variant={TypographyVariant.H2}>
                  <span className={styles.successSpan}>
                    Thank you for subscribing to
                  </span>
                  <span className={styles.successH2}>
                    Neurodiversity Academy!
                  </span>
                </Typography>
              </p>
              <p className={styles.description}>
                Check your email for our exclusive offers and latest news
              </p>
            </>
          )}
        </LoaderWrapper>
      </div>
    </div>
  );
}
