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
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import { MOODLE_INTRO_COURSE_ID } from '@/app/utilities/moodle/constants';
import getUser from '@/app/utilities/auth/getUser';

const stripe = new Stripe(process.env.STRIPE_SECRET || '');

const MOODLE_HOST_URL = process.env.MOODLE_HOST_URL || '';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    await consumeRateWithIp(req);

    const { searchParams } = req.nextUrl;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      throw new APIError({ error: 'Invalid session.' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer'],
    });

    if (session && session.payment_status === 'paid') {
      const customer = session.customer_details;
      if (!customer) {
        // TODO: Error handling
        // - Probably need to use constant 'key' type values for frontend to
        //   deal with accordingly
        throw new APIError({ error: 'Invalid customer.' });
      }

      const { email, name } = customer;

      if (!email || !name) {
        // TODO: Error handling
        // - Probably need to use constant 'key' type values for frontend to
        //   deal with accordingly
        throw new APIError({ error: 'Invalid customer.' });
      }

      let moodleUser: MoodleUserBasic | null =
        await getMoodleUserByEmail(email);

      if (!moodleUser) {
        moodleUser = await createMoodleUser({
          email,
          name,
        });
      }

      await enrolMoodleUserInCourse({
        userid: moodleUser.id,
        courseid: MOODLE_INTRO_COURSE_ID,
      });

      const authResponse = await isAuthenticated({ req });
      const callbackUrl = `${MOODLE_HOST_URL}/course/view.php?id=${MOODLE_INTRO_COURSE_ID}`;

      if (!(authResponse instanceof Response) && email === authResponse.email) {
        return NextResponse.redirect(callbackUrl);
      }

      // TODO: `getUser` fetches user from DynamoDB, we directly need to fetch from
      // cognito to determine if the user exists.
      // Use case:
      //  User signs up using idP, the user is not directly inserted into
      //  the DynamoDB, due to lack of convenient information from next-auth to
      //  determine whether the user is new (needs to be addressed later)
      const userExists: boolean = !!(await getUser(email));

      return NextResponse.redirect(
        `${HOST_URL}/${userExists ? 'login' : 'signup'}?${getSearchQuery({
          checkout_status: 'success',
          callbackUrl,
          email,
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
