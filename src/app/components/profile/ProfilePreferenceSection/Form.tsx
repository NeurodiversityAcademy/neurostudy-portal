'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import TextBox from '../../formElements/TextBox/TextBox';
import TextArea from '../../formElements/TextArea/TextArea';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useImperativeHandle,
} from 'react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';
import { UserProps } from '@/app/interfaces/User';
import { PREFERENCE_FIELDS } from '@/app/utilities/profile/constants';

type UserPreferenceProps = UserProps<(typeof PREFERENCE_FIELDS)[number]>;

const ProfilePreferenceForm: ForwardRefExoticComponent<
  RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef>((_, ref) => {
  const { data, isLoading } = useProfileContext();

  const methods: UseFormReturn<UserPreferenceProps> =
    useForm<UserPreferenceProps>({
      mode: 'onBlur',
    });

  useImperativeHandle(
    ref,
    () => ({
      methods,
    }),
    [methods]
  );

  return (
    <Form initialized={!isLoading} methods={methods}>
      <TextBox
        name='Conditions'
        label='Tell us about your Neuro-Condition'
        showLabel
        placeholder='E.G. ADHD'
        helperText='This will help us create personalised experience for you'
        defaultValue={data?.Conditions?.join(', ') || ''}
      />
      <TextBox
        name='Institutions'
        label='Learning Institutions'
        showLabel
        placeholder='E.G. California University'
        helperText='This will help us create personalised experience for you'
        defaultValue={data?.Institutions?.join(', ') || ''}
      />
      <TextArea
        name='EnvDescription'
        label='Describe a learning environment that you find ideal*'
        showLabel
        placeholder='Ex. - I prefer a remote setup with an option to opt for hybrid system'
        defaultValue={data?.EnvDescription || ''}
      />
    </Form>
  );
});

ProfilePreferenceForm.displayName = 'ProfilePreferenceForm';

export default ProfilePreferenceForm;
