import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { NextRequest, NextResponse } from 'next/server';
import { HOST_URL } from '@/app/utilities/constants';
import { getSearchQuery } from '@/app/utilities/common';
import { createMoodleCourseUrl } from '@/app/utilities/moodle/createMoodleCourseUrl';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ courseid: string }> }
): Promise<Response> {
  const params = await props.params;
  try {
    await consumeRateWithIp(req);

    const courseid = +params.courseid;

    const callbackUrl = await createMoodleCourseUrl(req, { courseid });

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
