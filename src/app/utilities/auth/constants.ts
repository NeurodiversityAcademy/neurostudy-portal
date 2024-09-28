import { DefaultValue } from "@/app/interfaces/FormElements";
import { USER_DATA_KEY } from "../profile/constants";
import { FieldValues } from "react-hook-form";

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
  [USER_DATA_KEY.FIRST_NAME]: '',
  [USER_DATA_KEY.LAST_NAME]: '',
  [USER_DATA_KEY.DATE_OF_BIRTH]: '', // ISO String - `2024-03-22T04:28:32.981Z`
  [USER_DATA_KEY.AGE]: 0,
  [USER_DATA_KEY.CONDITIONS]: [''],
  [USER_DATA_KEY.INSTITUTIONS]: [''],
  [USER_DATA_KEY.ENV_DESCRIPTION]: '',
  [USER_DATA_KEY.STRATEGIES]: [''],
  [USER_DATA_KEY.MANAGING_WAYS]: [''],
  [USER_DATA_KEY.EFFECTIVE_STRATEGY]: '',
  [USER_DATA_KEY.CONTENTS]: [''],
  [USER_DATA_KEY.COMFORTS]: [''],
  [USER_DATA_KEY.STRUGGLES]: [''],
  [USER_DATA_KEY.CHALLENGES]: [''],
  [USER_DATA_KEY.LEARNING_STYLE]: [''],
  [USER_DATA_KEY.FOCUS_AIDS]: false,
  [USER_DATA_KEY.MEET_NDL_LEARNERS]: false,
  [USER_DATA_KEY.ADJUSTMENTS]: [''],
  [USER_DATA_KEY.USED_TOOLS]: [''],
  [USER_DATA_KEY.GOALS]: [''],
  [USER_DATA_KEY.INTERESTS]: [''],
} as DefaultValue<FieldValues>;

export const USER_TABLE_NAME = process.env.USER_TABLE_NAME || 'NDAUsers';
export const USER_TABLE_PARTITION_ID = 'Email';
export const CALLBACK_URL_ON_LOGIN = '/profile';
