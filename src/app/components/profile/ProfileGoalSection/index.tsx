'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import TextBox from '../../formElements/TextBox/TextBox';
import goalIcon from '@/app/images/goalIcon.svg';
import ProfileCard from '../ProfileCard';

const ProfileGoalSection: React.FC = () => {
  const methods: UseFormReturn = useForm({
    mode: 'onBlur',
  });

  return (
    <ProfileCard
      leftIconSrc={goalIcon}
      leftIconAlt='Goals & Interests'
      title='Goals & Interests'
      collapsible
    >
      <Form methods={methods}>
        <TextBox
          name='Contents'
          label='What kind of content would you find most engaging?'
          showLabel
          placeholder='E.G. AR/VR'
          helperText='This will help us create personalised experience for you'
        />
      </Form>
    </ProfileCard>
  );
};

export default ProfileGoalSection;
