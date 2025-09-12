'use client';
import React, { useState } from 'react';
import TextBox from '@/app/components/formElements/TextBox/TextBox';
import TextArea from '@/app/components/formElements/TextArea/TextArea';
import ActionButton from '../buttons/ActionButton';
import styles from './contactUs.module.css';
import CRMCreateResponseInterface from '@/app/interfaces/CRMCreateResponseInterface';
import { UserFormSubmissionType } from '@/app/interfaces/UserFormSubmissionType';
import {
  BUTTON_STYLE,
  EMAIL_REGEX,
  FORM_ELEMENT_COL_WIDTH,
  NAME_REGEX,
  PERSONA_OPTIONS,
  PHONE_REGEX,
} from '@/app/utilities/constants';
import { registerContactData } from '@/app/utilities/register/registerContactData';
import Form from '@/app/components/formElements/Form';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import { notifyError, notifySuccess } from '@/app/utilities/common';
import LoaderWrapper from '../loader/LoaderWrapper';
import ContactUsLeftBanner from './ContactUsLeftBanner';
import classNames from 'classnames';
import Dropdown from '../formElements/Dropdown/Dropdown';
import { HSPersona } from '@/app/interfaces/UserSubscriptionType';

interface ContactFieldValues extends FieldValues {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  jobtitle: string;
  message: string;
  hs_persona: HSPersona;
}

// Persona mapping to HubSpot values
// Students  persona_1
// Education Providers  persona_2
// Education Professionals  persona_3
// Parent/Carers  persona_4
// Ally/Advocate  persona_5

const ContactUsForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const methods: UseFormReturn<ContactFieldValues> =
    useForm<ContactFieldValues>({ mode: 'onBlur' });

  const onSubmit = async (data: ContactFieldValues) => {
    const { firstname, lastname, email, phone, message, hs_persona } = data;
    const userRegistrationData: UserFormSubmissionType = {
      firstname,
      lastname,
      email,
      phone,
      message,
      hs_persona,
    };

    setIsLoading(true);

    try {
      const outcome = (await registerContactData(
        userRegistrationData
      )) as CRMCreateResponseInterface;
      console.log('failed', outcome);
      if (outcome.id) {
        notifySuccess('Successfully sent');
      }
    } catch (error) {
      notifyError(error as object);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className='row'>
        <ContactUsLeftBanner />
        <div className={classNames(styles.formColumn, 'col-md-8')}>
          <LoaderWrapper
            isLoading={isLoading}
            className={styles.formColumnWrapper}
            expandLoaderWidth
          >
            <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
              <TextBox
                name='firstname'
                label='First Name'
                required
                placeholder='Enter your first name'
                pattern={NAME_REGEX}
                showLabel
                cols={FORM_ELEMENT_COL_WIDTH.HALF}
              />
              <TextBox
                name='lastname'
                label='Last Name'
                required
                placeholder='Enter your last name'
                pattern={NAME_REGEX}
                showLabel
                cols={FORM_ELEMENT_COL_WIDTH.HALF}
              />
              <TextBox
                name='phone'
                label='Phone number'
                placeholder='Enter your phone number'
                pattern={PHONE_REGEX}
                showLabel
                cols={FORM_ELEMENT_COL_WIDTH.HALF}
              />
              <TextBox
                name='secondphone'
                label='Phone number (secondary)'
                placeholder='Enter your secondary phone number'
                pattern={PHONE_REGEX}
                showLabel
                cols={FORM_ELEMENT_COL_WIDTH.HALF}
              />
              <TextBox
                name='email'
                label='Email Address'
                required
                placeholder='Enter your email address'
                pattern={EMAIL_REGEX}
                showLabel
                cols={FORM_ELEMENT_COL_WIDTH.BIG}
              />
              <Dropdown
                name='hs_persona'
                label='I am a...'
                required
                placeholder='Select your role'
                options={PERSONA_OPTIONS}
                showLabel
                cols={FORM_ELEMENT_COL_WIDTH.BIG}
              />
              <TextArea
                name='message'
                label='Message'
                showLabel
                placeholder={'Enter your message'}
                rules={{
                  maxLength: 300,
                }}
              ></TextArea>
              <div className='my-3'>
                <ActionButton
                  type='submit'
                  label='Submit'
                  style={BUTTON_STYLE.Primary}
                  fullWidth
                />
              </div>
            </Form>
          </LoaderWrapper>
        </div>
      </div>
    </div>
  );
};

export default ContactUsForm;
