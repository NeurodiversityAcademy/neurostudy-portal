import Stripe from 'stripe';
import { INTERNAL_MODE } from '../constants';
import { getStripeSecret } from './helper';

let stripe: Stripe | undefined;

export default function getStripe(mode: INTERNAL_MODE): Stripe {
  stripe = stripe || new Stripe(getStripeSecret(mode));
  return stripe;
}
