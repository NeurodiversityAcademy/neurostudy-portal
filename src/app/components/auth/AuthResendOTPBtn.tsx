'use client';

import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import { notifyAxiosError, notifySuccess } from '@/app/utilities/common';
import { useEffect, useState } from 'react';
import LoaderWrapper from '../loader/LoaderWrapper';
import { DEFAULT_RESEND_OTP_WAIT_TIME } from '@/app/utilities/auth/constants';
import resendSignUpCode from '@/app/utilities/auth/resendSignUpCode';
import resetPassword from '@/app/utilities/auth/resetPassword';

interface PropType {
  username: string;
  resetPasswordCode?: boolean;
}

const getInitialSecondsLeft = (): number => Math.ceil(DEFAULT_RESEND_OTP_WAIT_TIME / 1000);

const AuthResendOTPBtn: React.FC<PropType> = ({ username, resetPasswordCode }: PropType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(getInitialSecondsLeft);
  const anyTimeLeft = secondsLeft > 0;
  const disabled = isLoading || anyTimeLeft;

  useEffect(() => {
    if (!anyTimeLeft) {
      return;
    }

    const intervalId = setInterval(() => {
      setSecondsLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [anyTimeLeft]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      if (!resetPasswordCode) {
        await resendSignUpCode({ username });
      } else {
        await resetPassword({ username });
      }
    } catch (ex) {
      notifyAxiosError(ex);
    } finally {
      notifySuccess('Code sent!');
      setSecondsLeft(getInitialSecondsLeft());
      setIsLoading(false);
    }
  };

  return (
    <LoaderWrapper isLoading={isLoading}>
      <ActionButton
        type='button'
        label={'Resend Code' + (anyTimeLeft ? ` (${secondsLeft})` : '')}
        disabled={disabled}
        style={BUTTON_STYLE.Secondary}
        onClick={onSubmit}
      />
    </LoaderWrapper>
  );
};

export default AuthResendOTPBtn;
