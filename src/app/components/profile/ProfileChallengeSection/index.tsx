'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import TextBox from '../../formElements/TextBox/TextBox';
import challengeIcon from '@/app/images/challengeIcon.svg';
import ProfileCard from '../ProfileCard';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';

const ProfileChallengeSection: React.FC = () => {
  const { data, isLoading } = useProfileContext();

  const methods: UseFormReturn = useForm({
    mode: 'onBlur',
  });

  return (
    <ProfileCard
      leftIconSrc={challengeIcon}
      leftIconAlt='Comfort & Challenges'
      title='Comfort & Challenges'
      collapsible
      isLoading={isLoading}
    >
      <Form initialized={!isLoading} methods={methods}>
        <TextBox
          name='Comforts'
          label='Tell us about things you are comfortable with'
          showLabel
          placeholder='E.G. Online classes'
          helperText='This will help us create personalised experience for you'
          defaultValue={data?.Comforts?.join(', ') || ''}
        />
        <TextBox
          name='Struggles'
          label='Tell us about things that you have struggled with in the past'
          showLabel
          placeholder='E.G. Zoom Meetings'
          helperText='This will help us create personalised experience for you'
          defaultValue={data?.Struggles?.join(', ') || ''}
        />
        <TextBox
          name='Challenges'
          label='Tell us about the challenges that you have faced in the past'
          showLabel
          placeholder='E.G. Online Learning'
          helperText='This will help us create personalised experience for you'
          defaultValue={data?.Challenges?.join(', ') || ''}
        />
      </Form>
    </ProfileCard>
  );
};

export default ProfileChallengeSection;
