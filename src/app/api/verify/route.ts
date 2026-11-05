import { NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import processAPIError from '@/app/utilities/api/processAPIError';
import {
  hasVerificationCookie,
  issueVerificationCookie,
} from '@/app/utilities/botid/verificationCookie';

export const runtime = 'nodejs';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

/**
 * Issues the short-lived search verification cookie after a BotID check.
 *
 * The search page renders results only when this cookie is valid, so a client
 * that cannot run the BotID script never receives provider data.
 */
export async function POST(request: NextRequest) {
  try {
    await consumeRateWithIp(request);

    if (await hasVerificationCookie()) {
      return new Response(null, { status: 204, headers: NO_STORE });
    }

    const verification = await checkBotId({
      // Ignored in production; lets search work in local development.
      developmentOptions: { bypass: 'HUMAN' },
    });

    if (verification.isBot || verification.isVerifiedBot) {
      return Response.json(
        { error: 'Search is available to people using this site.' },
        { status: 403, headers: NO_STORE },
      );
    }

    await issueVerificationCookie();

    return new Response(null, { status: 204, headers: NO_STORE });
  } catch (error) {
    return processAPIError(error instanceof Error ? error : null);
  }
}
