import { returnBadResponse } from '@/app/utilities/responses';
import { UserSubscriptionHandbookType } from '@/app/interfaces/UserSubscriptionType';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { isValidUserSubscriptionData } from '@/app/utilities/validation/validateUserSubscriptionData';
import CRMCreateResponseInterface from '@/app/interfaces/CRMCreateResponseInterface';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import processAPIError from '@/app/utilities/api/processAPIError';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await consumeRateWithIp(request);

    const data: UserSubscriptionHandbookType = await request.json();
    const { getHandbook, ...subscriptionData } = data;

    if (isValidUserSubscriptionData(subscriptionData)) {
      const response: CRMCreateResponseInterface | boolean =
        await registerCRMContact(subscriptionData);

      if (getHandbook === true) {
        // NOTE
        // We send the document regardless of failure

        const response = await fetch(process.env.HANDBOOK_SOURCE_URL || 'N/A');

        if (!response.ok) {
          return new Response('Failed to fetch PDF', { status: 500 });
        }

        const pdfBuffer = await response.arrayBuffer();

        return new Response(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="NDA Handbook.pdf"',
          },
        });
      }

      return new Response(JSON.stringify(response));
    }

    return returnBadResponse();
  } catch (ex) {
    return processAPIError(ex instanceof Error ? ex : null);
  }
}
