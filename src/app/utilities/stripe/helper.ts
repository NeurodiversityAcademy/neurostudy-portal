import { INTERNAL_MODE } from '../constants';
import { DEV_STRIPE_SECRET, STRIPE_SECRET } from './constants';

export const getStripeSecret = (mode: INTERNAL_MODE) => {
  if (mode === INTERNAL_MODE.DEV) {
    return DEV_STRIPE_SECRET;
  }

  return STRIPE_SECRET;
};
