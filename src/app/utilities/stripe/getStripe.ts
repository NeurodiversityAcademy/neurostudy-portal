import Stripe from 'stripe';
import { getStripeSecret } from './helper';

let stripe: Stripe | undefined;

export default function getStripe(): Stripe {
  stripe = stripe || new Stripe(getStripeSecret());
  return stripe;
}
