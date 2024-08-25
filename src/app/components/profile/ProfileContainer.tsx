import ProfileBody from './ProfileBody';
import styles from './profileContainer.module.css';
import ProfileRightSidebar from './ProfileRightSidebar';

const ProfileContainer: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className='row'>
        <div className='col-md-4'>
          <ProfileRightSidebar />
        </div>
        <div className='col-md-8'>
          <ProfileBody />
        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;
