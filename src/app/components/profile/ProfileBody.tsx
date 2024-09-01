'use client';

import styles from './profileBody.module.css';
import ProfileBodyHeader from './ProfileBodyHeader';
import ProfileInfoSection from './ProfileInfoSection';
import ProfilePreferenceSection from './ProfilePreferenceSection';
import ProfileChallengeSection from './ProfileChallengeSection';
import ProfileGoalSection from './ProfileGoalSection';
import ProfileStrategySection from './ProfileStrategySection';
import { useState } from 'react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';
import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import { useProfileContext } from '@/app/utilities/profile/ProfileProvider';

const ProfileBody: React.FC = () => {
  const { saveData, isLoading } = useProfileContext();

  // NOTE
  // Instead of using `ref.current` and nesting, we will attach attributes
  // directly to the root object
  const [refObj] = useState<Record<string, ProfileSectionRef | null>>({});
  const getRefUpdater = (key: string) => {
    return (ref: ProfileSectionRef | null) => {
      refObj[key] = ref;
    };
  };

  const onSubmit = async () => {
    const data: Record<string, unknown> = {};

    for (const key in refObj) {
      const ref = refObj[key];
      if (!ref) {
        break;
      }

      const {
        methods: { trigger, getValues },
      } = ref;

      if (!(await trigger(undefined, { shouldFocus: true }))) {
        break;
      }

      Object.assign(data, getValues());
    }

    saveData(data);
  };

  return (
    <div className={styles.container}>
      <ProfileBodyHeader />
      <ProfileInfoSection ref={getRefUpdater('info')} />
      <ProfilePreferenceSection />
      <ProfileChallengeSection />
      <ProfileGoalSection />
      <ProfileStrategySection ref={getRefUpdater('strategy')} />
      <div className={styles.btnContainer}>
        <ActionButton
          label='Cancel'
          style={BUTTON_STYLE.Secondary}
          className={styles.cancelBtn}
          disabled
        />
        <ActionButton
          label='Save'
          style={BUTTON_STYLE.Primary}
          className={styles.saveBtn}
          onClick={onSubmit}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default ProfileBody;
