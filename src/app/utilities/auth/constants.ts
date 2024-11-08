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
  Conditions: [''],
  Institutions: [''],
  EnvDescription: '',
  Strategies: [''],
  ManagingWays: [''],
  EffectiveStrategy: '',
  Contents: [''],
  Comforts: [''],
  Struggles: [''],
  Challenges: [''],
  LearningStyle: [''],
  FocusAids: false,
  MeetNDLearners: false,
  Adjustments: [''],
  UsedTools: [''],
  Goals: [''],
  Interests: [''],
};

export const USER_TABLE_NAME = process.env.USER_TABLE_NAME || 'NDAUsers';
export const USER_TABLE_PARTITION_ID = 'Email';
export const DEFAULT_SIGN_IN_REDIRECT_URL = '/profile';

export const OPTIONS_DATE = Array.from({ length: 31 }, (_, i) => ({
  label: (i + 1).toString(),
  value: i + 1,
}));

export const OPTIONS_MONTH = [
  { label: 'Jan', value: 1 },
  { label: 'Feb', value: 2 },
  { label: 'Mar', value: 3 },
  { label: 'Apr', value: 4 },
  { label: 'May', value: 5 },
  { label: 'Jun', value: 6 },
  { label: 'Jul', value: 7 },
  { label: 'Aug', value: 8 },
  { label: 'Sep', value: 9 },
  { label: 'Oct', value: 10 },
  { label: 'Nov', value: 11 },
  { label: 'Dec', value: 12 },
];

export const OPTIONS_YEAR = Array.from({ length: 100 }, (_, i) => ({
  label: (1915 + i).toString(),
  value: 1915 + i,
}));
