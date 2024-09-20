'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import TextArea from '../../formElements/TextArea/TextArea';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useImperativeHandle,
} from 'react';
import {
  ProfileSectionFormProps,
  ProfileSectionRef,
} from '@/app/interfaces/Profile';
import { UserProps } from '@/app/interfaces/User';
import {
  PREFERENCE_FIELDS,
  PROFILE_FIELD_OPTIONS,
} from '@/app/utilities/profile/constants';
import ProfileFormFooter from '../ProfileFormFooter';
import Dropdown from '../../formElements/Dropdown/Dropdown';
import CheckBox from '../../formElements/CheckBox/CheckBox';

type UserPreferenceProps = UserProps<(typeof PREFERENCE_FIELDS)[number]>;

const ProfilePreferenceForm: ForwardRefExoticComponent<
  PropsWithoutRef<ProfileSectionFormProps> & RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef, ProfileSectionFormProps>(
  ({ onSubmit, onCancel }, ref) => {
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
      <Form
        initialized={!isLoading}
        methods={methods}
        onSubmit={onSubmit && methods.handleSubmit(onSubmit)}
      >
        <Dropdown
          name='Conditions'
          label='Tell us about your Neuro-Condition'
          showLabel
          placeholder='E.G. ADHD'
          helperText='This will help us create personalised experience for you'
          creatable
          defaultValue={data?.Conditions || []}
          options={PROFILE_FIELD_OPTIONS.Conditions}
        />
        <Dropdown
          name='Institutions'
          label='Learning Institutions'
          showLabel
          placeholder='E.G. California University'
          helperText='This will help us create personalised experience for you'
          creatable
          defaultValue={data?.Institutions || []}
          options={PROFILE_FIELD_OPTIONS.Institutions}
        />
        <CheckBox
          name='LearningStyle'
          label='Select your preferred learning style'
          showLabel
          defaultValue={data?.LearningStyle || []}
          options={PROFILE_FIELD_OPTIONS.LearningStyle}
        />
        <Dropdown
          name='Adjustments'
          label='If you need any adjustments, add them here'
          showLabel
          placeholder='E.G. Better Classroom'
          helperText='This will help us create personalised experience for you'
          creatable
          defaultValue={data?.Adjustments || []}
          options={PROFILE_FIELD_OPTIONS.Adjustments}
        />
        <Dropdown
          name='UsedTools'
          label='Tell us about any accessibility tools you’ve used in the past'
          showLabel
          placeholder='E.G. Fidget'
          helperText='This will help us create personalised experience for you'
          creatable
          defaultValue={data?.UsedTools || []}
          options={PROFILE_FIELD_OPTIONS.UsedTools}
        />
        <TextArea
          name='EnvDescription'
          label='Describe a learning environment that you find ideal*'
          showLabel
          placeholder='Ex. - I prefer a remote setup with an option to opt for hybrid system'
          defaultValue={data?.EnvDescription || ''}
        />
        {onSubmit ? <ProfileFormFooter onCancel={onCancel} /> : null}
      </Form>
    );
  }
);

ProfilePreferenceForm.displayName = 'ProfilePreferenceForm';

export default ProfilePreferenceForm;
