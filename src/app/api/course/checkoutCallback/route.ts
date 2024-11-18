import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { NextRequest, NextResponse } from 'next/server';
import { HOST_URL } from '@/app/utilities/constants';
import APIError from '@/app/interfaces/APIError';
import { getSearchQuery } from '@/app/utilities/common';
import { getMoodleCourseUrl } from '@/app/utilities/moodle/helper';
import { MoodleUserBasic } from '@/app/interfaces/Moodle';
import getUser from '@/app/utilities/auth/getUser';
import isAuthenticated from '@/app/utilities/auth/isAuthenticated';
import AuthErrorResponse from '@/app/interfaces/AuthErrorResponse';
import { getMoodleUserByEmail } from '@/app/utilities/moodle/getMoodleUserByEmail';
import { createMoodleUser } from '@/app/utilities/moodle/createMoodleUser';
import { enrolMoodleUserInCourse } from '@/app/utilities/moodle/enrolMoodleUserInCourse';
import getStripe from '@/app/utilities/stripe/getStripe';
import {
  STRIPE_PRICE_META_MOODLE_COURSE_ID_KEY,
  STRIPE_SESSION_EXPANDABLE_ITEMS,
  STRIPE_SESSION_ID_KEY,
  STRIPE_SESSION_PAYMENT_STATUS,
} from '@/app/utilities/stripe/constants';

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = req.nextUrl;

  try {
    await consumeRateWithIp(req);

    const sessionId = searchParams.get(STRIPE_SESSION_ID_KEY);

    if (!sessionId) {
      throw new APIError({ error: 'Invalid session.' });
    }

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        STRIPE_SESSION_EXPANDABLE_ITEMS.CUSTOMER,
        STRIPE_SESSION_EXPANDABLE_ITEMS.LINE_ITEMS,
      ],
    });

    if (
      session &&
      session.payment_status === STRIPE_SESSION_PAYMENT_STATUS.PAID
    ) {
      const customer = session.customer_details;
      if (!customer) {
        throw new APIError({ error: 'Invalid customer.' });
      }

      const { email, name } = customer;

      if (!email) {
        throw new APIError({ error: 'Invalid customer.' });
      }

      const courseid: number = +(
        session.line_items?.data[0].price?.metadata?.[
          STRIPE_PRICE_META_MOODLE_COURSE_ID_KEY
        ] || 'null'
      );

      if (isNaN(courseid)) {
        throw new APIError({
          error: 'Product is not connected to any moodle course.',
        });
      }

      let moodleUser: MoodleUserBasic | null =
        await getMoodleUserByEmail(email);

      if (!moodleUser) {
        moodleUser = await createMoodleUser({
          email,
          name: name || email.split('@')[0],
        });
      }

      const userid = moodleUser.id;

      await enrolMoodleUserInCourse({ userid, courseid });

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
        //  User signs up using Google SSO, the user is not directly inserted into
        //  the DynamoDB, due to lack of convenient information from next-auth to
        //  determine whether the user is new (needs to be addressed later)
        return !!(await getUser(email));
      })();

      const url = (() => {
        if (userExists) {
          return getMoodleCourseUrl(courseid);
        }

        const callbackUrl = `/moodle/course/${courseid}`;

        return `${HOST_URL}/signup?${getSearchQuery({
          checkout_status: 'success',
          callbackUrl,
          email,
        })}`;
      })();

      return NextResponse.redirect(url);
    } else {
      throw new APIError({ error: 'Payment not completed.' });
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
