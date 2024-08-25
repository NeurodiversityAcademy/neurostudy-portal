import styles from './profileBody.module.css';
import ProfileBodyHeader from './ProfileBodyHeader';
import ProfileCard from './ProfileCard';
import ProfileInfoSection from './ProfileInfoSection';
import preferenceIcon from '@/app/images/preferenceIcon.svg';
import challengeIcon from '@/app/images/challengeIcon.svg';
import goalIcon from '@/app/images/goalIcon.svg';
import strategyIcon from '@/app/images/strategyIcon.svg';

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
      <ProfileCard
        leftIconSrc={preferenceIcon}
        leftIconAlt='Neuro Condition & Learning Preferences'
        title='Neuro Condition & Learning Preferences'
        collapsible
      >
        Section for inputs!
      </ProfileCard>
      <ProfileCard
        leftIconSrc={challengeIcon}
        leftIconAlt='Comfort & Challenges'
        title='Comfort & Challenges'
        collapsible
      >
        Section for inputs!
      </ProfileCard>
      <ProfileCard
        leftIconSrc={goalIcon}
        leftIconAlt='Goals & Interests'
        title='Goals & Interests'
        collapsible
      >
        Section for inputs!
      </ProfileCard>
      <ProfileCard
        leftIconSrc={strategyIcon}
        leftIconAlt='Strategies & Support'
        title='Strategies & Support'
        collapsible
      >
        Section for inputs!
      </ProfileCard>
    </div>
  );
};

export default ProfileBody;
