'use client';

import TextBox from '@/app/components/formElements/TextBox/TextBox';
import TextArea from '@/app/components/formElements/TextArea/TextArea';
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
import Form from '@/app/components/formElements/Form';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import { notifyError } from '@/app/utilities/common';
import useWindowWidth from '@/app/hooks/useWindowWidth';
import LoaderWrapper from '../loader/LoaderWrapper';
import { FORM_STATE } from '@/app/utilities/auth/constants';
import { useAppSelector } from '@/app/redux/store';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '@/app/redux/features/loader/loader-slice';
import { resetForm, setFormState } from '@/app/redux/features/form/form-slice';

interface ContactFieldValues extends FieldValues {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  jobtitle: string;
  message: string;
}

const ContactUsForm: React.FC = () => {
  const isLoading = useAppSelector((state) => state.loaderReducer.isLoading);
  const formState = useAppSelector((state) => state.formReducer.formState);
  const dispatch = useDispatch();
  const windowWidth = useWindowWidth();

  const methods: UseFormReturn<ContactFieldValues> =
    useForm<ContactFieldValues>({ mode: 'onBlur' });

  const onSubmit = async (data: ContactFieldValues) => {
    const { firstname, lastname, email, phone, jobtitle, message } = data;

    const userRegistrationData: UserFormSubmissionType = {
      firstname,
      lastname,
      email,
      phone,
      jobtitle,
      message,
    };

    dispatch(setIsLoading(true));

    try {
      const outcome = (await registerContactData(
        userRegistrationData
      )) as CRMCreateResponseInterface;
      if (outcome.id) {
        dispatch(setFormState(FORM_STATE.DONE));
      }
    } catch (error) {
      notifyError(error as object);
    } finally {
      dispatch(setIsLoading(false));
      setTimeout(() => dispatch(resetForm()), 2000);
    }
  };

  return (
    <LoaderWrapper isLoading={isLoading} expandLoaderWidth>
      <div className={styles.container}>
        <div className={styles.title}>
          <Typography
            variant={TypographyVariant.H2}
            className={styles.mobileTitle}
          >
            Contact Us
          </Typography>
          {formState === FORM_STATE.DONE ? (
            <Typography variant={TypographyVariant.Body1}>
              Thank you for contacting us. We will get back to you shortly.
            </Typography>
          ) : (
            <Typography variant={TypographyVariant.Body1}>
              We will try our best to get back to you as soon as possible
            </Typography>
          )}
        </div>
        <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
          <div className={styles.textboxBody}>
            <div className={styles.nameArea}>
              <div>
                <TextBox
                  name='firstname'
                  label='First Name'
                  required
                  placeholder='Enter your first name'
                  pattern={NAME_REGEX}
                  showLabel
                />
              </div>
              <div>
                <TextBox
                  name='lastname'
                  label='Last Name'
                  required
                  placeholder='Enter your last name'
                  pattern={NAME_REGEX}
                  showLabel
                />
              </div>
            </div>
            <div className={styles.phoneArea}>
              <div>
                <TextBox
                  name='phone'
                  label='Phone number'
                  placeholder='Enter your phone number'
                  pattern={PHONE_REGEX}
                  showLabel
                />
              </div>
              <div className={styles.secondPhone}>
                <TextBox
                  name='phone'
                  label='Phone number'
                  placeholder='Enter your phone number'
                  pattern={PHONE_REGEX}
                  showLabel
                />
              </div>
            </div>
            <div className={styles.emailJobArea}>
              <div>
                <TextBox
                  name='email'
                  label='Email Address'
                  required
                  placeholder='Enter your email address'
                  pattern={EMAIL_REGEX}
                  showLabel
                />
              </div>
              <div>
                <TextBox
                  name='jobtitle'
                  label='Designation'
                  required
                  placeholder='Teacher, Student, Institute, Other'
                  showLabel
                />
              </div>
            </div>
            <div className={styles.messageArea}>
              <TextArea
                name='message'
                label='Message'
                showLabel
                placeholder={'Enter your message'}
                rules={{
                  maxLength: 300,
                }}
              ></TextArea>
            </div>
            <div
              className={
                windowWidth <= 480
                  ? 'border-box-parent col-md-12'
                  : styles.primaryBtn
              }
            >
              <ActionButton
                type='submit'
                label='Submit'
                style={BUTTON_STYLE.Primary}
                fullWidth
                className={windowWidth <= 480 ? 'mt-3 mb-3' : ''}
              />
            </div>
          </div>
        </Form>
      </div>
    </LoaderWrapper>
  );
};

export default ContactUsForm;
