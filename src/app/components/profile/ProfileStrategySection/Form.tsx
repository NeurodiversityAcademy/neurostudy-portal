'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
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
  PROFILE_FIELD_OPTIONS,
  STRATEGY_FIELDS,
} from '@/app/utilities/profile/constants';
import TextArea from '../../formElements/TextArea/TextArea';
import ProfileFormFooter from '../ProfileFormFooter';
import Dropdown from '../../formElements/Dropdown/Dropdown';
import Radio from '../../formElements/Radio/Radio';

type UserStrategyProps = UserProps<(typeof STRATEGY_FIELDS)[number]>;

const ProfileStrategyForm: ForwardRefExoticComponent<
  PropsWithoutRef<ProfileSectionFormProps> & RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef, ProfileSectionFormProps>(
  ({ onSubmit, onCancel }, ref) => {
    const { data, isLoading } = useProfileContext();

    const methods: UseFormReturn<UserStrategyProps> =
      useForm<UserStrategyProps>({
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
          name='Strategies'
          label='What strategies do you use to manage your time effectively?'
          showLabel
          placeholder='E.G. Focused Learning'
          creatable
          defaultValue={data?.Strategies || []}
          options={PROFILE_FIELD_OPTIONS.Strategies}
        />
        <Dropdown
          name='ManagingWays'
          label='How do you manage sensory overload in learning environments?'
          showLabel
          placeholder='E.G. Focus'
          creatable
          defaultValue={data?.ManagingWays || []}
          options={PROFILE_FIELD_OPTIONS.ManagingWays}
        />
        <Radio
          name='FocusAids'
          label='Would access to fidget toys, noise-canceling headphones, or other focus aids be beneficial 
  for you?'
          showLabel
          defaultValue={data?.FocusAids}
          options={PROFILE_FIELD_OPTIONS.FocusAids}
        />
        <Radio
          name='MeetNDLearners'
          label='Would you be interested in meeting/collaborating with other ND learners?*'
          showLabel
          defaultValue={data?.MeetNDLearners}
          options={PROFILE_FIELD_OPTIONS.MeetNDLearners}
        />
        <TextArea
          name='EffectiveStrategy'
          label='What is one learning strategy that has been particularly helpful for you?*'
          showLabel
          placeholder={`Ex. - Having a good night's sleep, waking up early and start studying in a tranquil environment`}
          defaultValue={data?.EffectiveStrategy || ''}
        />
        {onSubmit ? <ProfileFormFooter onCancel={onCancel} /> : null}
      </Form>
    );
  }
);

ProfileStrategyForm.displayName = 'ProfileStrategyForm';

export default ProfileStrategyForm;
