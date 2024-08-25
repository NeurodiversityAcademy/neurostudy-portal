import styles from './profileBody.module.css';
import ProfileBodyHeader from './ProfileBodyHeader';
import ProfileCard from './ProfileCard';
import ProfileInfoSection from './ProfileInfoSection';

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
      <ProfileCard title='Neuro Condition & Learning Preferences' collapsible>
        Section for inputs!
      </ProfileCard>
      <ProfileCard title='Comfort & Challenges' collapsible>
        Section for inputs!
      </ProfileCard>
      <ProfileCard title='Goals & Interests' collapsible>
        Section for inputs!
      </ProfileCard>
      <ProfileCard title='Strategies & Support' collapsible>
        Section for inputs!
      </ProfileCard>
    </div>
  );
};

export default ProfileBody;
