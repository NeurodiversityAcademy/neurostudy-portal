import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { NextRequest, NextResponse } from 'next/server';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';
import { CourseCheckoutSession } from '@/app/interfaces/Course';
import {
  COURSE_CHECKOUT_CALLBACK_URL,
  COURSE_TEST_ENROL_KEY,
} from '@/app/utilities/course/constants';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import getStripe from '@/app/utilities/stripe/getStripe';
import { INTERNAL_MODE } from '@/app/utilities/constants';
import { getStripeIntroProductPriceId } from '@/app/utilities/stripe/helper';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    await consumeRateWithIp(req);

    const { searchParams } = req.nextUrl;
    const mode = searchParams.has(COURSE_TEST_ENROL_KEY)
      ? INTERNAL_MODE.DEV
      : INTERNAL_MODE.PROD;

    const authResponse = await isAuthenticated({ req });

    let customer_email: string | undefined = undefined;
    if (!(authResponse instanceof Response)) {
      customer_email = authResponse.email;
    }

    const testParam =
      mode === INTERNAL_MODE.DEV ? `&${COURSE_TEST_ENROL_KEY}` : '';

    const stripe = getStripe(mode);
    const price = getStripeIntroProductPriceId(mode);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      mode: 'payment',
      ...(customer_email && { customer_email }),
      success_url: `${COURSE_CHECKOUT_CALLBACK_URL}?session_id={CHECKOUT_SESSION_ID}${testParam}`,
      cancel_url: `${COURSE_CHECKOUT_CALLBACK_URL}?status=canceled&session_id={CHECKOUT_SESSION_ID}${testParam}`,
    });

    const data: CourseCheckoutSession = {
      url: session.url,
    };

    return NextResponse.json(data);
  } catch (ex) {
    return processCourseAPIError(ex);
  }
}
