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
import { GOAL_FIELDS } from '@/app/utilities/profile/constants';

type UserGoalProps = UserProps<(typeof GOAL_FIELDS)[number]>;

const ProfileGoalForm: ForwardRefExoticComponent<
  RefAttributes<ProfileSectionRef>
> = forwardRef<ProfileSectionRef>((_, ref) => {
  const { data, isLoading } = useProfileContext();

  const methods: UseFormReturn<UserGoalProps> = useForm<UserGoalProps>({
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
        name='Contents'
        label='What kind of content would you find most engaging?'
        showLabel
        placeholder='E.G. AR/VR'
        helperText='This will help us create personalised experience for you'
        defaultValue={data?.Contents?.join(', ') || ''}
      />
    </Form>
  );
});

ProfileGoalForm.displayName = 'ProfileGoalForm';

export default ProfileGoalForm;
