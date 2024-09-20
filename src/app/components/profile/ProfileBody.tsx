'use client';

import styles from './profileBody.module.css';
import ProfileBodyHeader from './ProfileBodyHeader';
import ProfileInfoSection from './ProfileInfoSection';
import ProfilePreferenceSection from './ProfilePreferenceSection';
import ProfileChallengeSection from './ProfileChallengeSection';
import ProfileGoalSection from './ProfileGoalSection';
import ProfileStrategySection from './ProfileStrategySection';

const ProfileBody: React.FC = () => {
  return (
    <div className={styles.container}>
      <ProfileBodyHeader />
      <ProfileInfoSection />
      <ProfilePreferenceSection />
      <ProfileChallengeSection />
      <ProfileGoalSection />
      <ProfileStrategySection />
    </div>
  );
};

export default ProfileBody;
