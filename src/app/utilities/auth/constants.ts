// NOTE
// We're trying this variable to closely resemble AWS's `nextStep`
// variables possible values
// https://docs.amplify.aws/gen1/nextjs/build-a-backend/auth/enable-sign-up/
export enum FORM_STATE {
  INITIALIZED = 'INITIALIZED',
  CONFIRM_SIGN_UP = 'CONFIRM_SIGN_UP',
  COMPLETE_AUTO_SIGN_IN = 'COMPLETE_AUTO_SIGN_IN',
  DONE = 'DONE',
  CONFIRM_RESET_PASSWORD_WITH_CODE = 'CONFIRM_RESET_PASSWORD_WITH_CODE',
}

export const DEFAULT_RESEND_OTP_WAIT_TIME =
  process.env.NODE_ENV === 'development' ? 10 * 1000 : 60 * 1000;

export const INVALID_CREDENTIALS_MESSAGE = 'Incorrect username or password.';

export const DEFAULT_SESSION_AGE_IN_SECONDS = 2 * 24 * 60 * 60;

// NOTE
// These will be here until we utilize `zod` or similar validation library
// This helps us to generate a type based on the given attribute values
// and validate/assert based on that as well
export const DEFAULT_USER = {
  FirstName: '',
  LastName: '',
  DOB: '', // ISO String - `2024-03-22T04:28:32.981Z`
  Age: 0,
  Conditions: [],
  Institutions: [],
  EnvDescription: '',
  Strategies: [],
  ManagingWays: [],
  EffectiveStrategy: '',
  Contents: [],
  Comforts: [],
  Struggles: [],
  Challenges: [],
};

export const USER_TABLE_NAME = process.env.USER_TABLE_NAME || 'NDAUsers';
export const USER_TABLE_PARTITION_ID = 'Email';
