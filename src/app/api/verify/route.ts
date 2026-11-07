import { NextRequest } from 'next/server';
import { checkBotId } from 'botid/server';
import APIError from '@/app/interfaces/APIError';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import processAPIError from '@/app/utilities/api/processAPIError';
import {
  hasVerificationCookie,
  issueVerificationCookie,
} from '@/app/utilities/botid/verificationCookie';
import { observeApi, type ApiTrace } from '@/app/utilities/observability/apiTrace';

export const runtime = 'nodejs';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

async function handlePost(request: NextRequest, trace: ApiTrace): Promise<Response> {
  trace.setUsage({ surface: 'api', mode: 'n/a', usedModel: false });

  try {
    try {
      await consumeRateWithIp(request);
      trace.setGate({ rateLimit: 'pass' });
    } catch (error) {
      trace.setGate({ rateLimit: 'blocked' });
      trace.setOutcome('rate_limited', 'rate_limit');
      throw error;
    }

    if (await hasVerificationCookie()) {
      trace.setOutcome('ok', 'already_verified');
      return new Response(null, { status: 204, headers: NO_STORE });
    }

    const verification = await checkBotId({
      // Ignored in production; lets search work in local development.
      developmentOptions: { bypass: 'HUMAN' },
    });

    if (verification.isBot || verification.isVerifiedBot) {
      trace.setGate({ botId: 'blocked' });
      trace.setOutcome('forbidden', 'bot');
      return Response.json(
        { error: 'Search is available to people using this site.' },
        { status: 403, headers: NO_STORE },
      );
    }
    trace.setGate({ botId: 'pass' });

    await issueVerificationCookie();

    trace.setOutcome('ok', 'verified');
    return new Response(null, { status: 204, headers: NO_STORE });
  } catch (error) {
    if (error instanceof APIError) {
      // The specific outcome (for example rate_limited) was recorded above.
      return processAPIError(error);
    }
    trace.setOutcome('error', 'unhandled_route_error');
    return processAPIError(error instanceof Error ? error : null);
  }
}

/**
 * Issues the short-lived search verification cookie after a BotID check.
 *
 * The search page renders results only when this cookie is valid, so a client
 * that cannot run the BotID script never receives provider data.
 */
export async function POST(request: NextRequest) {
  return observeApi('verify', request, (trace) => handlePost(request, trace));
}
