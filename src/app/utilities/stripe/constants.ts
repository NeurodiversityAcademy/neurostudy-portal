import { INFO_EMAIL_ADDRESS } from '../constants';

const STRIPE_INTRO_PRODUCT_PRICE_LOOKUP_KEY =
  process.env.STRIPE_INTRO_PRODUCT_PRICE_LOOKUP_KEY ?? '';
const STRIPE_PRICE_META_MOODLE_COURSE_ID_KEY =
  process.env.STRIPE_PRICE_META_MOODLE_COURSE_ID_KEY ?? '';

const STRIPE_SECRET: string = process.env.STRIPE_SECRET ?? '';

if (
  process.env.NODE_ENV !== 'development' &&
  typeof window === 'undefined' &&
  (!STRIPE_SECRET ||
    !STRIPE_INTRO_PRODUCT_PRICE_LOOKUP_KEY ||
    !STRIPE_PRICE_META_MOODLE_COURSE_ID_KEY)
) {
  throw new Error('Stripe variables have not been properly initialized.');
}

export {
  STRIPE_INTRO_PRODUCT_PRICE_LOOKUP_KEY,
  STRIPE_SECRET,
  STRIPE_PRICE_META_MOODLE_COURSE_ID_KEY,
};

export const DEFAULT_STRIPE_ERROR_MESSAGE = `An unexpected error occurred during the checkout 
  process. For prompt assistance, please contact us at ${INFO_EMAIL_ADDRESS}.`;
export const DEFAULT_STRIPE_CONCLUDING_ERROR_MESSAGE = `If you believe there is a mistake, please contact us at ${INFO_EMAIL_ADDRESS}.`;

export const STRIPE_SESSION_ID_KEY = 'session_id';

export enum STRIPE_SESSION_EXPANDABLE_ITEMS {
  CUSTOMER = 'customer',
  LINE_ITEMS = 'line_items',
}

export enum STRIPE_SESSION_PAYMENT_STATUS {
  PAID = 'paid',
  UNPAID = 'unpaid',
  NO_PAYMENT_REQUIRED = 'no_payment_required',
}

export enum STRIPE_SHIPPING_ALLOWED_COUNTRIES {
  AUSTRALIA = 'AU',
  USA = 'US',
  UNITED_KINGDOM = 'GB',
  CANADA = 'CA',
  NEW_ZEALAND = 'NZ',
}
