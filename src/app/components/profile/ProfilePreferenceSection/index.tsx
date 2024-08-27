'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import TextBox from '../../formElements/TextBox/TextBox';
import preferenceIcon from '@/app/images/preferenceIcon.svg';
import ProfileCard from '../ProfileCard';
import TextArea from '../../formElements/TextArea/TextArea';

const ProfilePreferenceSection: React.FC = () => {
  const methods: UseFormReturn = useForm({
    mode: 'onBlur',
  });

  return (
    <ProfileCard
      leftIconSrc={preferenceIcon}
      leftIconAlt='Neuro Condition & Learning Preferences'
      title='Neuro Condition & Learning Preferences'
      collapsible
    >
      <Form methods={methods}>
        <TextBox
          name='Conditions'
          label='Tell us about your Neuro-Condition'
          showLabel
          placeholder='E.G. ADHD'
          helperText='This will help us create personalised experience for you'
        />
        <TextBox
          name='Institutions'
          label='Learning Institutions'
          showLabel
          placeholder='E.G. California University'
          helperText='This will help us create personalised experience for you'
        />
        <TextArea
          name='EnvDescription'
          label='Describe a learning environment that you find ideal*'
          showLabel
          placeholder='Ex. - I prefer a remote setup with an option to opt for hybrid system'
        />
      </Form>
    </ProfileCard>
  );
};

export default ProfilePreferenceSection;
