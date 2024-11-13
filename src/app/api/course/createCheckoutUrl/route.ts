import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { NextRequest, NextResponse } from 'next/server';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';
import { CourseCheckoutSession } from '@/app/interfaces/Course';
import { COURSE_CHECKOUT_CALLBACK_URL } from '@/app/utilities/course/constants';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import getStripe from '@/app/utilities/stripe/getStripe';
import {
  STRIPE_INTRO_PRODUCT_PRICE_LOOKUP_KEY,
  STRIPE_PRICE_META_MOODLE_COURSE_ID_KEY,
} from '@/app/utilities/stripe/constants';
import APIError from '@/app/interfaces/APIError';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    await consumeRateWithIp(req);

    const authResponse = await isAuthenticated({ req });

    let customer_email: string | undefined = undefined;
    if (!(authResponse instanceof Response)) {
      customer_email = authResponse.email;
    }

    const stripe = getStripe();
    const priceResponse = await stripe.prices.list({
      lookup_keys: [STRIPE_INTRO_PRODUCT_PRICE_LOOKUP_KEY],
    });
    const price = priceResponse.data[0];

    if (!price) {
      throw new APIError({ error: 'Invalid price encountered.' });
    }

    if (!price.metadata[STRIPE_PRICE_META_MOODLE_COURSE_ID_KEY]) {
      throw new APIError({ error: 'Invalid moodle product encountered.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      ...(customer_email && { customer_email }),
      success_url: `${COURSE_CHECKOUT_CALLBACK_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${COURSE_CHECKOUT_CALLBACK_URL}?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
    });

    const data: CourseCheckoutSession = {
      url: session.url,
    };

    return NextResponse.json(data);
  } catch (ex) {
    return processCourseAPIError(ex);
  }
}
