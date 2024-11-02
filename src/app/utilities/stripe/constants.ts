import { INFO_EMAIL_ADDRESS } from '../constants';

const STRIPE_INTRO_PRODUCT_PRICE_ID: string =
  process.env.STRIPE_INTRO_PRODUCT_PRICE_ID ?? '';

const STRIPE_SECRET: string = process.env.STRIPE_SECRET ?? '';

if (
  process.env.NODE_ENV !== 'development' &&
  (!STRIPE_INTRO_PRODUCT_PRICE_ID || !STRIPE_SECRET)
) {
  throw new Error('Stripe variables have not been properly initialized.');
}

export { STRIPE_INTRO_PRODUCT_PRICE_ID, STRIPE_SECRET };

export const DEFAULT_STRIPE_ERROR_MESSAGE = `An unexpected error occurred during the checkout 
  process. For prompt assistance, please contact us at ${INFO_EMAIL_ADDRESS}.`;
export const DEFAULT_STRIPE_CONCLUDING_ERROR_MESSAGE = `If you believe there is a mistake, please contact us at ${INFO_EMAIL_ADDRESS}.`;
