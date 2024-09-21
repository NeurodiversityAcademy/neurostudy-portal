import Link from 'next/link';
import styles from './auth.module.css';
import ActionButton from '@/app/components/buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import Typography, {
  TypographyVariant,
} from '@/app/components/typography/Typography';
import GoogleLogo from '@/app/images/googleLogo.svg';
import FacebookLogo from '@/app/images/facebookLogo.svg';
import { notifyError } from '@/app/utilities/common';
import { signIn } from 'next-auth/react';
import { CALLBACK_URL_ON_LOGIN } from '@/app/utilities/auth/constants';

type AuthFormFooterProps = {
  text?: string;
  toText?: string;
  to?: string;
};

const AuthFormFooter: React.FC<AuthFormFooterProps> = ({
  text,
  toText,
  to,
}: AuthFormFooterProps) => {
  const signInWithGoogle = async () => {
    try {
      await signIn(
        'cognito',
        { redirect: true, callbackUrl: CALLBACK_URL_ON_LOGIN },
        { identity_provider: 'Google' }
      );
    } catch (ex) {
      notifyError(ex as object);
    }
  };

  return (
    <>
      <div className={styles.breakLineWrapper}>
        <hr className={styles.breakLine} />
        <span className={styles.or}>or</span>
        <hr className={styles.breakLine} />
      </div>
      <div className={styles.loginProviderContainer}>
        <ActionButton
          type='button'
          icon={GoogleLogo}
          iconPosition='left'
          label='Google'
          style={BUTTON_STYLE.Secondary}
          onClick={signInWithGoogle}
        />
        <ActionButton
          type='button'
          icon={FacebookLogo}
          iconPosition='left'
          label='Facebook'
          disabled
          style={BUTTON_STYLE.Secondary}
        />
      </div>
      <Typography
        variant={TypographyVariant.Body2}
        className={styles.callToAction}
      >
        {text}
        <Link href={to ?? '#'}>{toText}</Link>
      </Typography>
    </>
  );
};

export default AuthFormFooter;
