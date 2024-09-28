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
  USER_DATA_KEY,
} from '@/app/utilities/profile/constants';
import ProfileFormFooter from '../ProfileFormFooter';
import Dropdown from '../../formElements/Dropdown/Dropdown';
import CheckBox from '../../formElements/CheckBox/CheckBox';

type UserPreferenceProps = UserProps<(typeof PREFERENCE_FIELDS)[number]>;

const ProfilePreferenceForm: ForwardRefExoticComponent<
  PropsWithoutRef<ProfileSectionFormProps> & RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef, ProfileSectionFormProps>(
  ({ onSubmit, onCancel }, ref) => {
    const { data } = useProfileContext();

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
        methods={methods}
        onSubmit={onSubmit && methods.handleSubmit(onSubmit)}
      >
        <Dropdown<UserPreferenceProps>
          name={USER_DATA_KEY.CONDITIONS}
          label='Tell us about your Neuro-Condition'
          showLabel
          placeholder='E.G. ADHD'
          helperText='This will help us create personalised experience for you'
          creatable
          defaultValue={data?.Conditions}
          options={PROFILE_FIELD_OPTIONS.Conditions}
        />
        <Dropdown<UserPreferenceProps>
          name={USER_DATA_KEY.INSTITUTIONS}
          label='Learning Institutions'
          showLabel
          placeholder='E.G. California University'
          helperText='This will help us create personalised experience for you'
          creatable
          defaultValue={data?.Institutions}
          options={PROFILE_FIELD_OPTIONS.Institutions}
        />
        <CheckBox<UserPreferenceProps>
          name={USER_DATA_KEY.LEARNING_STYLE}
          label='Select your preferred learning style'
          showLabel
          defaultValue={data?.LearningStyle}
          options={PROFILE_FIELD_OPTIONS.LearningStyle}
        />
        <Dropdown<UserPreferenceProps>
          name={USER_DATA_KEY.ADJUSTMENTS}
          label='If you need any adjustments, add them here'
          showLabel
          placeholder='E.G. Better Classroom'
          helperText='This will help us create personalised experience for you'
          creatable
          defaultValue={data?.Adjustments}
          options={PROFILE_FIELD_OPTIONS.Adjustments}
        />
        <Dropdown<UserPreferenceProps>
          name={USER_DATA_KEY.USED_TOOLS}
          label='Tell us about any accessibility tools you’ve used in the past'
          showLabel
          placeholder='E.G. Fidget'
          helperText='This will help us create personalised experience for you'
          creatable
          defaultValue={data?.UsedTools}
          options={PROFILE_FIELD_OPTIONS.UsedTools}
        />
        <TextArea<UserPreferenceProps>
          name={USER_DATA_KEY.ENV_DESCRIPTION}
          label='Describe a learning environment that you find ideal*'
          showLabel
          placeholder='Ex. - I prefer a remote setup with an option to opt for hybrid system'
          defaultValue={data?.EnvDescription}
        />
        {onSubmit ? <ProfileFormFooter onCancel={onCancel} /> : null}
      </Form>
    );
  }
);

ProfilePreferenceForm.displayName = 'ProfilePreferenceForm';

export default ProfilePreferenceForm;
