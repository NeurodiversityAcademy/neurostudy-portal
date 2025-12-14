import { returnBadResponse } from '@/app/utilities/responses';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { registerSenderContact } from '@/app/utilities/register/registerSenderContact';
import { isValidContactUsFormData } from '@/app/utilities/validation/validateContactUsFormData';
import { updateHubspotSubscription } from '@/app/utilities/register/updateHubspotSubscription';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!isValidContactUsFormData(data)) {
      return returnBadResponse();
    }

    const { email, firstname, lastname, phone, hs_persona, subscription } =
      data;

    const crmResponse = await registerCRMContact({ ...data });

    // update Hubspot Subscription
    try {
      await updateHubspotSubscription(email, subscription);
    } catch (error) {
      console.error('HubSpot subscription update failed:', error);
    }

    // only add to sender if user opted in
    let senderResponse = null;
    if (subscription) {
      senderResponse = await registerSenderContact(
        { email, firstname, lastname, phone, subscription },
        hs_persona || 'persona_1'
      );
    }

    return new Response(
      JSON.stringify({
        crm: crmResponse,
        sender: senderResponse,
        subscription,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return returnBadResponse();
  }
}
