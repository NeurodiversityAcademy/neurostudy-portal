import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { NextRequest, NextResponse } from 'next/server';
import { HOST_URL, INTERNAL_MODE } from '@/app/utilities/constants';
import APIError from '@/app/interfaces/APIError';
import { getSearchQuery } from '@/app/utilities/common';
import { getMoodleCourseUrl } from '@/app/utilities/moodle/helper';
import { MoodleUserBasic } from '@/app/interfaces/Moodle';
import { MOODLE_INTRO_COURSE_ID } from '@/app/utilities/moodle/constants';
import getUser from '@/app/utilities/auth/getUser';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';
import { COURSE_TEST_ENROL_KEY } from '@/app/utilities/course/constants';
import { getMoodleUserByEmail } from '@/app/utilities/moodle/getMoodleUserByEmail';
import { createMoodleUser } from '@/app/utilities/moodle/createMoodleUser';
import { enrolMoodleUserInCourse } from '@/app/utilities/moodle/enrolMoodleUserInCourse';
import getStripe from '@/app/utilities/stripe/getStripe';
import { STRIPE_SESSION_ID_KEY } from '@/app/utilities/stripe/constants';

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = req.nextUrl;
  const mode = searchParams.has(COURSE_TEST_ENROL_KEY)
    ? INTERNAL_MODE.DEV
    : INTERNAL_MODE.PROD;

  try {
    await consumeRateWithIp(req);

    const sessionId = searchParams.get(STRIPE_SESSION_ID_KEY);

    if (!sessionId) {
      throw new APIError({ error: 'Invalid session.' });
    }

    const stripe = getStripe(mode);

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

      let moodleUser: MoodleUserBasic | null = await getMoodleUserByEmail(
        email,
        mode
      );

      if (!moodleUser) {
        moodleUser = await createMoodleUser(
          {
            email,
            name,
          },
          mode
        );
      }

      const userid = moodleUser.id;

      await enrolMoodleUserInCourse(
        {
          userid,
          courseid: MOODLE_INTRO_COURSE_ID,
        },
        mode
      );

      const authResponse = await isAuthenticated({ req });

      const userExists = await (async () => {
        const isSameUserLoggedIn =
          !(authResponse instanceof AuthErrorResponse) &&
          authResponse.email === email;

        if (isSameUserLoggedIn) {
          return true;
        }

        // TODO: `getUser` fetches user from DynamoDB, we directly need to fetch from
        // cognito to determine if the user exists.
        // Use case:
        //  User signs up using idP, the user is not directly inserted into
        //  the DynamoDB, due to lack of convenient information from next-auth to
        //  determine whether the user is new (needs to be addressed later)
        return !!(await getUser(email));
      })();

      const url = (() => {
        if (userExists) {
          return getMoodleCourseUrl(MOODLE_INTRO_COURSE_ID, mode);
        }

        return `${HOST_URL}/signup?${getSearchQuery({
          checkout_status: 'success',
          callbackUrl: '/moodle/course/' + MOODLE_INTRO_COURSE_ID,
          email,
        })}`;
      })();

      return NextResponse.redirect(url);
    } else {
      throw new Error('Payment not completed.');
    }
  } catch (ex) {
    const error = ex as object;

    return NextResponse.redirect(
      `${HOST_URL}?${getSearchQuery({
        [COURSE_TEST_ENROL_KEY]: mode === INTERNAL_MODE.DEV ? '' : undefined,
        checkout_status: 'failure',
        error: error && 'message' in error ? error.message : undefined,
      })}`
    );
  }
}
