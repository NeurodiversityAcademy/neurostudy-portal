import classNames from 'classnames';
import styles from '../page.module.css';
import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';

const AuthLeftBanner: React.FC = () => {
  return (
    <div className={classNames(styles.bannerColumn, 'col-md-4')}>
      <Typography
        variant={TypographyVariant.H3}
        color='var(--GhostWhite)'
        className='my-0'
      >
        Signup/Login to Neurodiversity Academy
      </Typography>
      <div className={styles.bannerDesc}>
        <Typography
          variant={TypographyVariant.H3}
          color='var(--GhostWhite)'
          className='mt-0 mb-3'
        >
          Lorem ipsum
        </Typography>
        <Typography variant={TypographyVariant.Body2} color='var(--GhostWhite)'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
          laboriosam delectus tenetur perspiciatis qui labore eius sint cumque
          sunt.
        </Typography>
      </div>
    </div>
  );
};

export default AuthLeftBanner;
