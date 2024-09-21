import APIError from '@/app/interfaces/APIError';
import {
  DEFAULT_ASSERTION_ERROR_MESSAGE,
  RETURN_DEFAULT_ERROR_MESSAGE,
} from './constants';

const throwAssertionError = (message: string): void => {
  throw new APIError({
    error: RETURN_DEFAULT_ERROR_MESSAGE
      ? DEFAULT_ASSERTION_ERROR_MESSAGE
      : message,
    status: 400,
  });
};

export default throwAssertionError;
