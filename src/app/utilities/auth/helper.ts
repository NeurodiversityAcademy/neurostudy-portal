import queryString from '../queryString';
import { DEFAULT_SIGN_IN_REDIRECT_URL } from './constants';

export const getCallbackUrlOnSignIn = () => {
  let callbackUrl: string | string[] | undefined =
    queryString.parse().callbackUrl;
  if (Array.isArray(callbackUrl)) {
    callbackUrl = undefined;
  }

  return callbackUrl || DEFAULT_SIGN_IN_REDIRECT_URL;
};
