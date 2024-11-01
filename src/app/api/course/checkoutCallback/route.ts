import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { NextRequest, NextResponse } from 'next/server';
import { HOST_URL } from '@/app/utilities/constants';
import APIError from '@/app/interfaces/APIError';
import { getSearchQuery } from '@/app/utilities/common';
import {
  createMoodleUser,
  enrolMoodleUserInCourse,
  getMoodleCourseUrl,
  getMoodleUserByEmail,
} from '@/app/utilities/moodle/helper';
import { MoodleUserBasic } from '@/app/interfaces/Moodle';
import { MOODLE_INTRO_COURSE_ID } from '@/app/utilities/moodle/constants';
import getUser from '@/app/utilities/auth/getUser';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';
import stripe from '@/app/utilities/stripe';

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
        throw new APIError({ error: 'Invalid customer.' });
      }

      const { email, name } = customer;

      if (!email || !name) {
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

      const userid = moodleUser.id;

      await enrolMoodleUserInCourse({
        userid,
        courseid: MOODLE_INTRO_COURSE_ID,
      });

      const authResponse = await isAuthenticated({ req });

      // TODO: `getUser` fetches user from DynamoDB, we directly need to fetch from
      // cognito to determine if the user exists.
      // Use case:
      //  User signs up using idP, the user is not directly inserted into
      //  the DynamoDB, due to lack of convenient information from next-auth to
      //  determine whether the user is new (needs to be addressed later)
      let userExists: boolean | undefined =
        !(authResponse instanceof AuthErrorResponse) &&
        authResponse.email === email
          ? true
          : undefined;
      const getIfUserExists = async (): Promise<boolean> => {
        if (userExists === undefined) {
          userExists = !!(await getUser(email));
        }
        return userExists;
      };

      return NextResponse.redirect(
        (await getIfUserExists())
          ? getMoodleCourseUrl(MOODLE_INTRO_COURSE_ID)
          : `${HOST_URL}/signup?${getSearchQuery({
              checkout_status: 'success',
              callbackUrl: '/moodle/course/' + MOODLE_INTRO_COURSE_ID,
              email,
            })}`
      );
    } else {
      throw new Error('Payment not completed.');
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
