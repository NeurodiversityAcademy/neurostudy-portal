import styles from './profileContainer.module.css';
import ProfileHeader from './ProfileHeader';

const ProfileContainer: React.FC = () => {
  return (
    <div className={styles.container}>
      <ProfileHeader />
    </div>
  );
};

export default ProfileContainer;
