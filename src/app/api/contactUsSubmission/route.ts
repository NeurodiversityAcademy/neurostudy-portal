/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserFormSubmissionType } from '@/app/interfaces/UserFormSubmissionType';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { isValidContactUsFormData } from '@/app/utilities/validation/validateContactUsFormData';
import { returnBadResponse } from '@/app/utilities/responses';

export async function POST(request: Request) {
  const data = await request.json();
  if (isValidContactUsFormData(data)) {
    const userContactForm: UserFormSubmissionType = {
      ...data,
    };
    const response = await registerCRMContact(userContactForm);
    return new Response(JSON.stringify(response));
  }
  return returnBadResponse();
}
