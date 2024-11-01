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
