'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import Form from '../../formElements/Form';
import TextBox from '../../formElements/TextBox/TextBox';
import strategyIcon from '@/app/images/strategyIcon.svg';
import ProfileCard from '../ProfileCard';
import TextArea from '../../formElements/TextArea/TextArea';

const ProfileStrategySection: React.FC = () => {
  const methods: UseFormReturn = useForm({
    mode: 'onBlur',
  });

  return (
    <ProfileCard
      leftIconSrc={strategyIcon}
      leftIconAlt='Strategies & Support'
      title='Strategies & Support'
      collapsible
    >
      <Form methods={methods}>
        <TextBox
          name='Strategies'
          label='What strategies do you use to manage your time effectively?'
          showLabel
          placeholder='E.G. Focused Learning'
        />
        <TextBox
          name='ManagingWays'
          label='How do you manage sensory overload in learning environments?'
          showLabel
          placeholder='E.G. Focus'
        />
        <TextArea
          name='EffectiveStrategy'
          label='What is one learning strategy that has been particularly helpful for you?*'
          showLabel
          placeholder={`Ex. - Having a good night's sleep, waking up early and start studying in a tranquil environment`}
        />
      </Form>
    </ProfileCard>
  );
};

export default ProfileStrategySection;
