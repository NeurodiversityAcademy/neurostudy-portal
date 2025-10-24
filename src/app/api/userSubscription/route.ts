import { returnBadResponse } from '@/app/utilities/responses';
import { UserSubscriptionHandbookType } from '@/app/interfaces/UserSubscriptionType';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { registerSenderContact } from '@/app/utilities/register/registerSenderContact';
import { isValidUserSubscriptionData } from '@/app/utilities/validation/validateUserSubscriptionData';
import { consumeRateWithIp } from '@/app/utilities/api/rateLimiter';
import processAPIError from '@/app/utilities/api/processAPIError';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await consumeRateWithIp(request);

    const data: UserSubscriptionHandbookType = await request.json();
    const { getHandbook, hs_persona, ...subscriptionData } = data;

    if (isValidUserSubscriptionData(subscriptionData)) {
      const crmResponse = await registerCRMContact(subscriptionData);
      const senderResponse = await registerSenderContact(
        {
          email: subscriptionData.email,
          ...(subscriptionData.firstName && {
            firstname: subscriptionData.firstName,
          }),
          ...(subscriptionData.lastName && {
            lastname: subscriptionData.lastName,
          }),
        },
        hs_persona
      );

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

      return new Response(
        JSON.stringify({ crm: crmResponse, sender: senderResponse })
      );
    }

    return returnBadResponse();
  } catch (ex) {
    return processAPIError(ex instanceof Error ? ex : null);
  }
}
