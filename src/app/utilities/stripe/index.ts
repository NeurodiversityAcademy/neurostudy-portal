import Stripe from 'stripe';
import { STRIPE_SECRET } from './constants';

const stripe = new Stripe(STRIPE_SECRET);

export default stripe;
