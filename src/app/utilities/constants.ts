export enum INDUSTRY {
  TEACHER = 'teacher',
}
export enum COMPANY {
  INDIVIDUAL = 'individual',
}

export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

export const MOBILE_REGEX = /^(?:\+61|0)[2-478](?:\d{8})$/;
export const PHONE_REGEX = /^(?:\+61|0)?[2-9]\d{8}$/;

export const NAME_REGEX = /^[a-zA-Z0-9. -]+$/;

export enum BUTTON_STYLE {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}

export enum TEXTBOX_VARIANT {
  LONG = 'long',
  LONGER = 'longer',
  REGULAR = 'regular',
}

export const HOST_URL =
  process.env.NEXT_PUBLIC_HOST_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://neurodiversityacademy.com');
export const SITE_NAME = 'Neurodiversity Academy';
export const LANGUAGES = { 'en-US': '/en-US' };
export const LOCALE = 'en_US';

export enum META_TYPE {
  WEBSITE = 'website',
  ARTICLE = 'article',
}

export enum META_KEY {
  HOME = 'home',
  NEURODIVERGENT_MATES = 'neurodivergentmates',
  NEURODIVERSITY_TRAINING = 'neurodiversitytraining',
  ADVISORY_CONSULTING = 'advisoryconsulting',
  NETWORKING = 'networking',
  COACHING = 'coaching',
  PLACEMENTS = 'placements',
  ABOUT = 'about',
  CONTACT = 'contact',
  ARTICLES = 'articles',
  ARTICLE = 'article',
  BLOGS = 'blogs',
  BLOG = 'blog',
  SIGNUP = 'signup',
  LOGIN = 'login',
  FORGOT_PASSWORD = 'forgotpassword',
  PROFILE = 'profile',
  COURSES = 'courses',
}

export const TOAST_UNKNOWN_ERROR_MESSAGE =
  'Unknown error occurred, please try back again later.';

export const TOAST_DEV_IN_PROGRESS_MESSAGE =
  'This (or part of this) feature is currently under development. Please check back later.';

export enum FORM_ELEMENT_COL_WIDTH {
  SMALLER = 3,
  SMALL = 4,
  HALF = 6,
  BIG = 8,
  FULL = 12,
}

export const DEFAULT_SLIDER_MIN = 0;
export const DEFAULT_SLIDER_MAX = 100;
export const DEFAULT_SLIDER_STEP = 1;

export const DEFAULT_TOGGLE_OPTIONS = {
  on: { label: 'On', value: true },
  off: { label: 'Off', value: false },
};

export const INFO_EMAIL_ADDRESS = 'info@neurodiversityacademy.com';

export enum INTERNAL_MODE {
  PROD = 'PROD',
  DEV = 'DEV',
}
