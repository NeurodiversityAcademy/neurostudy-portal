import Stripe from 'stripe';
import { getStripeSecret } from './helper';

const STRIPE_API_VERSION = '2026-06-24.dahlia' as const;

let stripe: Stripe | undefined;

export default function getStripe(): Stripe {
  stripe =
    stripe ||
    new Stripe(getStripeSecret(), {
      apiVersion: STRIPE_API_VERSION,
    });
  return stripe;
}
