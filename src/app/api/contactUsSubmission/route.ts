import { returnBadResponse } from '@/app/utilities/responses';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { registerSenderContact } from '@/app/utilities/register/registerSenderContact';
import { isValidContactUsFormData } from '@/app/utilities/validation/validateContactUsFormData';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!isValidContactUsFormData(data)) {
      return returnBadResponse();
    }

    const { email, firstname, lastname, phone, hs_persona } = data;

    const crmResponse = await registerCRMContact({ ...data });

    const senderResponse = await registerSenderContact(
      { email, firstname, lastname, phone },
      hs_persona || 'persona_1'
    );

    return new Response(
      JSON.stringify({ crm: crmResponse, sender: senderResponse }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact Us submission error:', error);
    return returnBadResponse();
  }
}
