'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { notifyError } from '../utilities/common';
import { TOAST_UNKNOWN_ERROR_MESSAGE } from '../utilities/constants';
import queryString from '../utilities/queryString';

const useAuthError = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const error = searchParams.get('error');

  useEffect(() => {
    if (!error) {
      return;
    }

    // NOTE
    // toast doesn't render in the first synchronous execution, hence
    // the timeout usage
    setTimeout(() => {
      switch (error) {
        case 'OAuthCallback':
          notifyError('Error during authentication. Please try again later.');
          break;
        case 'Callback':
          notifyError('User was not granted access. Please try again later.');
          break;
        case 'AuthRequired':
          notifyError('Please login first.');
          break;
        default:
          notifyError(TOAST_UNKNOWN_ERROR_MESSAGE);
      }

      const newSearch = queryString.stringify(
        { error: undefined },
        { useLocationSearch: true }
      );

      router.replace(newSearch + window.location.hash);
    });
  }, [error, router, searchParams]);
};

export default useAuthError;
