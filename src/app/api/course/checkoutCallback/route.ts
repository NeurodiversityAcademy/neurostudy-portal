import Stripe from 'stripe';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import { NextRequest, NextResponse } from 'next/server';
import { HOST_URL } from '@/app/utilities/constants';
import APIError from '@/app/interfaces/APIError';
import { getSearchQuery } from '@/app/utilities/common';

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
