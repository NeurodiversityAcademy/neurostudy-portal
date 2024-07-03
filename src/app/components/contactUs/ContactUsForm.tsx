'use client';
import React, { useState } from 'react';
import TextBox, { TextboxVariant } from '../textbox/Textbox';
import ActionButton from '../buttons/ActionButton';
import styles from './contactUs.module.css';
import CRMCreateResponseInterface from '@/app/interfaces/CRMCreateResponseInterface';
import { UserFormSubmissionType } from '@/app/interfaces/UserFormSubmissionType';
import Typography, { TypographyVariant } from '../typography/Typography';
import {
  BUTTON_STYLE,
  EMAIL_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
} from '@/app/utilities/constants';
import { registerContactData } from '@/app/utilities/register/registerContactData';
import TextArea from '../textArea/TextArea';

const ContactUsForm: React.FC = () => {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const userRegistrationData: UserFormSubmissionType = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      phone: phoneNumber,
      jobtitle: jobtitle,
      message: message,
    };
    if (
      firstNameError ||
      lastNameError ||
      phoneNumberError ||
      emailError ||
      jobtitleError ||
      messageError
    ) {
      return;
    } else {
      const outcome = (await registerContactData(
        userRegistrationData
      )) as CRMCreateResponseInterface;
      if (outcome.id) {
        setSubmissionSuccess(true);
      }
    }
  };

  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState<string | undefined>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState<string | undefined>(
    ''
  );
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [jobtitle, setJobtitle] = useState('');
  const [jobtitleError, setJobtitleError] = useState<string | undefined>();
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState<string | undefined>();

  return (
    <div className={styles.container}>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className={styles.title}>
          <Typography variant={TypographyVariant.H1}>Contact Us</Typography>
          <Typography variant={TypographyVariant.Body1}>
            We will try our best to get back to you as soon as possible
          </Typography>
        </div>
        <div className={styles.textboxBody}>
          <div className={styles.name}>
            <div className={styles.textArea}>
              <TextBox
                name={'FirstName'}
                label={'First Name (required)'}
                type={'text'}
                value={firstName}
                required={true}
                placeholder={'Enter your first name'}
                errorMessage={firstNameError}
                onChange={(e) => setFirstName(e.target.value.trim())}
                onBlur={() =>
                  !NAME_REGEX.test(firstName)
                    ? setFirstNameError('First Name is invalid')
                    : setFirstNameError(undefined)
                }
              />
            </div>
            <div className={styles.textArea}>
              <TextBox
                name={'LastName'}
                label={'Last Name (required)'}
                type={'text'}
                value={lastName}
                required={true}
                placeholder={'Enter your last name'}
                errorMessage={lastNameError}
                onBlur={() =>
                  !NAME_REGEX.test(lastName)
                    ? setLastNameError('Last Name is invalid')
                    : setLastNameError(undefined)
                }
                onChange={(e) => setLastName(e.target.value.trim())}
              />
            </div>
          </div>
          <div className={styles.textArea}>
            <TextBox
              name={'PhoneNumber'}
              label={'Phone Number (required)'}
              type={'text'}
              value={phoneNumber}
              errorMessage={phoneNumberError}
              required={false}
              placeholder={'Enter your phone number'}
              onBlur={() => {
                !PHONE_REGEX.test(phoneNumber)
                  ? setPhoneNumberError('Phone number is invalid')
                  : setPhoneNumberError(undefined);
              }}
              onChange={(e) => setPhoneNumber(e.target.value.trim())}
            />
          </div>
          <div className={styles.textArea}>
            <TextBox
              variant={TextboxVariant.LONGER}
              name={'Email'}
              label={'Email Address (required)'}
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
          <div className={styles.textArea}>
            <TextBox
              variant={TextboxVariant.LONGER}
              name={'jobtitle'}
              label={'Job Title (required)'}
              type={'text'}
              value={jobtitle}
              required={true}
              placeholder={'Teacher, Student, Institute, Other'}
              errorMessage={jobtitleError}
              onBlur={() =>
                !jobtitle.trim()
                  ? setJobtitleError('The Job title is invalid')
                  : setJobtitleError(undefined)
              }
              onChange={(e) => setJobtitle(e.target.value.trim())}
            />
          </div>
          <div className={`${styles.textArea} ${styles.message}`}>
            <TextArea
              name={'Message'}
              label={'Message'}
              value={message}
              required={false}
              placeholder={'Enter your message'}
              maxlength={300}
              onBlur={() =>
                !message.trim()
                  ? setMessageError('')
                  : setMessageError(undefined)
              }
              onChange={(e) => setMessage(e.target.value)}
            ></TextArea>
          </div>
          <ActionButton
            type='submit'
            label='Submit'
            style={BUTTON_STYLE.Primary}
            className={styles.primaryBtn}
          />
          {submissionSuccess && (
            <div className={styles.success}>
              <Typography variant={TypographyVariant.Body1}>
                Thank you for contacting us. We will get back to you shortly.
              </Typography>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactUsForm;
