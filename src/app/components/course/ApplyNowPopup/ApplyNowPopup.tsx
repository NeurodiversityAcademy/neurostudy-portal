'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import styles from '../../handbook/handbookPopup.module.css';
import Dialog from '@/app/components/dialog';
import ActionButton from '@/app/components/buttons/ActionButton';
import Form from '@/app/components/formElements/Form';
import TextBox from '@/app/components/formElements/TextBox/TextBox';
import Loader from '@/app/components/loader/Loader';
import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import courseInterestedSrc from '@/app/images/courseInterestedIllustration.png';

interface ApplyNowPopupProps {
  open: boolean;
  onClose: () => void;
}

interface ApplyNowFieldValues extends FieldValues {
  full_name: string;
  number?: string; // optional numeric identifier the user may provide
  phone: string;
  email: string;
}

export default function ApplyNowPopup({ open, onClose }: ApplyNowPopupProps) {
  const methods: UseFormReturn<ApplyNowFieldValues> =
    useForm<ApplyNowFieldValues>({ mode: 'onBlur' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const onSubmit = async (data: ApplyNowFieldValues) => {
    setIsLoading(true);
    console.log(data);
    try {
      // TODO: Replace this with a real API call to submit the application
      await new Promise((resolve) => setTimeout(resolve, 700));
      // For now, mark as submitted and let the caller close the dialog
      setIsSubmitted(true);
    } catch (ex) {
      // keep notify logic minimal — upstream can provide better error handling
      // eslint-disable-next-line no-console
      console.error('Apply Now submit failed', ex);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className={styles.container}>
        <Image
          src={courseInterestedSrc}
          alt='Interested in this course'
          className={styles.mailBoxImg}
          quality={100}
        />

        <Form
          methods={methods}
          onSubmit={methods.handleSubmit(onSubmit)}
          className={styles.form}
        >
          <Typography variant={TypographyVariant.H3} className='m-0'>
            Apply for this course
          </Typography>
          <Typography variant={TypographyVariant.Body3} className='mb-3'>
            Fill in a few details and we&apos;ll get back to you about next
            steps.
          </Typography>

          <TextBox
            name='full_name'
            label='Full name'
            required
            placeholder='Your full name'
          />
          <TextBox
            name='number'
            label='Number (optional)'
            placeholder='Reference / student number'
          />
          <TextBox
            name='phone'
            label='Phone number'
            required
            placeholder='Phone number'
          />
          <TextBox
            name='email'
            type='email'
            label='Email Address'
            required
            placeholder='Email address'
          />

          <div>
            <ActionButton
              type='submit'
              label={isSubmitted ? 'Submitted' : 'Submit Application'}
              style={BUTTON_STYLE.Primary}
              fullWidth
              disabled={isSubmitted}
            />
          </div>

          {isSubmitted && (
            <Typography
              variant={TypographyVariant.Body2}
              className={styles.fileReadyText}
            >
              Thanks — your application has been received. We&apos;ll contact
              you soon.
            </Typography>
          )}

          <Loader isLoading={isLoading} />
        </Form>
      </div>
    </Dialog>
  );
}
