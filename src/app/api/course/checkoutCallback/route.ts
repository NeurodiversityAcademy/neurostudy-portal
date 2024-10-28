import Stripe from 'stripe';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { NextRequest, NextResponse } from 'next/server';
import { HOST_URL } from '@/app/utilities/constants';
import APIError from '@/app/interfaces/APIError';
import { getSearchQuery } from '@/app/utilities/common';
import {
  createMoodleUser,
  enrolMoodleUserInCourse,
  getMoodleUserByEmail,
} from '@/app/utilities/moodle/helper';
import { MoodleUserBasic } from '@/app/interfaces/Moodle';

const stripe = new Stripe(process.env.STRIPE_SECRET || '');

export async function GET(req: NextRequest): Promise<Response> {
  try {
    await consumeRateWithIp(req);

    const { searchParams } = req.nextUrl;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      throw new APIError({ error: 'Invalid session.' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent', 'line_items'],
    });

    if (session && session.payment_status === 'paid') {
      const customer = session.customer_details;
      if (!customer) {
        // TEMP
        // TODO
        // Probably need to use constant 'key' type values for frontend to
        // deal with accordingly
        throw new APIError({ error: 'Invalid customer.' });
      }

      const { email, name } = customer;

      if (!email || !name) {
        // TEMP
        // TODO
        // Probably need to use constant 'key' type values for frontend to
        // deal with accordingly
        throw new APIError({ error: 'Invalid customer.' });
      }

      // TEMP
      // TODO
      // Use interfaces/types
      let moodleUser: MoodleUserBasic | null =
        await getMoodleUserByEmail(email);

      if (!moodleUser) {
        moodleUser = await createMoodleUser({
          email,
          name,
        });
      }

      await enrolMoodleUserInCourse({ userid: moodleUser.id });

      return NextResponse.redirect(
        `${HOST_URL}?${getSearchQuery({
          checkout_status: 'success',
        })}`
      );
    } else {
      throw new Error('Payment not completed');
    }
  } catch (ex) {
    const error = ex as object;

    return NextResponse.redirect(
      `${HOST_URL}?${getSearchQuery({
        checkout_status: 'failure',
        error: error && 'message' in error ? error.message : undefined,
      })}`
    );
  }
}
