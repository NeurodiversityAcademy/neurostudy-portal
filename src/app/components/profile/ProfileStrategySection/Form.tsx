'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import TextBox from '../../formElements/TextBox/TextBox';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';
import {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useImperativeHandle,
} from 'react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';
import { UserProps } from '@/app/interfaces/User';
import { STRATEGY_FIELDS } from '@/app/utilities/profile/constants';
import TextArea from '../../formElements/TextArea/TextArea';

type UserStrategyProps = UserProps<(typeof STRATEGY_FIELDS)[number]>;

const ProfileStrategyForm: ForwardRefExoticComponent<
  RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef>((_, ref) => {
  const { data, isLoading } = useProfileContext();

  const methods: UseFormReturn<UserStrategyProps> = useForm<UserStrategyProps>({
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
        name='Strategies'
        label='What strategies do you use to manage your time effectively?'
        showLabel
        placeholder='E.G. Focused Learning'
        defaultValue={data?.Strategies?.join(', ') || ''}
      />
      <TextBox
        name='ManagingWays'
        label='How do you manage sensory overload in learning environments?'
        showLabel
        placeholder='E.G. Focus'
        defaultValue={data?.ManagingWays?.join(', ') || ''}
      />
      <TextArea
        name='EffectiveStrategy'
        label='What is one learning strategy that has been particularly helpful for you?*'
        showLabel
        placeholder={`Ex. - Having a good night's sleep, waking up early and start studying in a tranquil environment`}
        defaultValue={data?.EffectiveStrategy || ''}
      />
    </Form>
  );
});

ProfileStrategyForm.displayName = 'ProfileStrategyForm';

export default ProfileStrategyForm;
