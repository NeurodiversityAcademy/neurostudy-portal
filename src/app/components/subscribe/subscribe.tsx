'use client';
import React, { useState } from 'react';
import TextBox, { TextboxVariant } from '../textbox/Textbox';
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

export default function Subscribe() {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const userSubscriptionData: UserSubscriptionType = {
      email: email,
    };
    if (emailError) {
      return;
    } else {
      const outcome: CRMCreateResponseInterface =
        await registerSubscriptionData(userSubscriptionData);

      if (outcome.id || !outcome) {
        setSubmissionSuccess(true);
      }
    }
  };

  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();

  return (
    <div className={styles.main}>
      <form onSubmit={(event) => handleSubmit(event)}>
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
          <div className={styles.contentWrapper}>
            {!submissionSuccess ? (
              <>
                <div>
                  <p className={styles.title}>Subscribe to our Newsletter!</p>
                </div>
                <p className={styles.description}>
                  Be the first to get exclusive offers and latest news
                </p>
                <div className={styles.inputArea}>
                  <div className={styles.textArea}>
                    <TextBox
                      variant={TextboxVariant.LONG}
                      name={'Email'}
                      label={''}
                      type={'email'}
                      value={email}
                      required={true}
                      errorMessage={emailError}
                      placeholder={'Enter your email address'}
                      onBlur={() =>
                        !EMAIL_REGEX.test(email)
                          ? setEmailError('Email Address is invalid')
                          : setEmailError(undefined)
                      }
                      onChange={(e) => setEmail(e.target.value.trim())}
                    />
                  </div>
                  <ActionButton
                    type='submit'
                    label='Subscribe Now'
                    style={BUTTON_STYLE.Primary}
                    className={styles.primaryBtn}
                    fullWidth
                  />
                </div>
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
          </div>
        </div>
      </form>
    </div>
  );
}
