import styles from './profileBody.module.css';
import ProfileBodyHeader from './ProfileBodyHeader';
import ProfileCard from './ProfileCard';

const ProfileBody: React.FC = () => {
  return (
    <div className={styles.container}>
      <ProfileBodyHeader />
      <ProfileCard title='Personal Information'>
        Section for inputs!
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
