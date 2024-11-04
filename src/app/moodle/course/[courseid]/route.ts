import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { NextRequest, NextResponse } from 'next/server';
import { HOST_URL, INTERNAL_MODE } from '@/app/utilities/constants';
import { getSearchQuery } from '@/app/utilities/common';
import { createMoodleCourseUrl } from '@/app/utilities/moodle/createMoodleCourseUrl';
import { COURSE_TEST_ENROL_KEY } from '@/app/utilities/course/constants';

export async function GET(
  req: NextRequest,
  { params }: { params: { courseid: string } }
): Promise<Response> {
  try {
    await consumeRateWithIp(req);

    const { searchParams } = req.nextUrl;
    const mode = searchParams.has(COURSE_TEST_ENROL_KEY)
      ? INTERNAL_MODE.DEV
      : INTERNAL_MODE.PROD;

    const courseid = +params.courseid;

    const callbackUrl = await createMoodleCourseUrl(req, { courseid }, mode);

    if (callbackUrl) {
      return NextResponse.redirect(callbackUrl);
    }

    throw new Error('Course and/or user is invalid.');
  } catch (ex) {
    const error = ex as object;

    return NextResponse.redirect(
      `${HOST_URL}?${getSearchQuery({
        moodle_redirection_status: 'failure',
        error: error && 'message' in error ? error.message : undefined,
      })}`
    );
  }
}
