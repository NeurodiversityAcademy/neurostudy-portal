import { returnBadResponse } from '@/app/utilities/responses';
import { UserFormSubmissionType } from '@/app/interfaces/UserFormSubmissionType';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { isValidContactUsFormData } from '@/app/utilities/validation/validateContactUsFormData';

export async function POST(request: Request) {
  const data = await request.json();
  console.log('Incoming contact form data:', data);

  const isValid = isValidContactUsFormData(data);
  console.log('Validation result:', isValid);

  if (isValid) {
    const userContactForm: UserFormSubmissionType = {
      ...data,
    };
    const response = await registerCRMContact(userContactForm);
    return new Response(JSON.stringify(response));
  }
  return returnBadResponse();
}
