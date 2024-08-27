import styles from './profileBody.module.css';
import ProfileBodyHeader from './ProfileBodyHeader';
import ProfileCard from './ProfileCard';
import ProfileInfoSection from './ProfileInfoSection';
import ProfilePreferenceSection from './ProfilePreferenceSection';
import ProfileChallengeSection from './ProfileChallengeSection';
import ProfileGoalSection from './ProfileGoalSection';
import ProfileStrategySection from './ProfileStrategySection';

const user: Record<string, string | number> = {
  username: 'Olivia Rhyme',
  firstName: 'Olivia',
  lastName: 'Rhyme',
  email: 'Olivia@gmail.com',
  age: 24,
};

const ProfileBody: React.FC = () => {
  return (
    <div className={styles.container}>
      <ProfileBodyHeader user={user} />
      <ProfileCard title='Personal Information'>
        <ProfileInfoSection user={user} />
      </ProfileCard>
      <ProfilePreferenceSection />
      <ProfileChallengeSection />
      <ProfileGoalSection />
      <ProfileStrategySection />
    </div>
  );
};

export default ProfileBody;
