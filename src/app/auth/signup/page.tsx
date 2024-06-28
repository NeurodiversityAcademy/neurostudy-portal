import styles from '../page.module.css';
import AuthLeftBanner from '../component/AuthLeftBanner';
import classNames from 'classnames';
import AuthInitSignUp from '../component/AuthInitSignUp';
import AuthFinishSignUp from '../component/AuthFinishSignUp';

const SignUpPage = () => {
  // TODO
  // https://trello.com/c/mkNpbNGg/108-sign-up-implement-persistent-user-sessions
  // We'll configure `user` or relevant variable to determine the user, if in session
  const user = null;

  return (
    <main className={styles.container}>
      <div className='row'>
        <AuthLeftBanner />
        <div className={classNames(styles.formColumn, 'col-md-8')}>
          <div className={styles.formColumnWrapper}>
            {user ? <AuthFinishSignUp /> : <AuthInitSignUp />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
