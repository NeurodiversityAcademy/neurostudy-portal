import { returnBadResponse } from '@/app/utilities/responses';
import { UserFormSubmissionType } from '@/app/interfaces/UserFormSubmissionType';
import { registerCRMContact } from '@/app/utilities/registerCRMContact';
import { SubscriptionType } from '@/app/interfaces/SubscriptionType';

export async function POST(request: Request) {    
  const data = await request.json();
  if (isValidSubscriptionFormData(data)) {
    const subscription: SubscriptionType = {
      ...data,
    };
    const response = await registerCRMContact(subscription);
    return new Response(JSON.stringify(response));
  }
  return returnBadResponse();
}

function isValidSubscriptionFormData(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  obj: any
): obj is SubscriptionType {
  const requiredKeys: (keyof SubscriptionType)[] = [
    'email',
  ];
  const keys = Object.keys(obj) as (keyof SubscriptionType)[];
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
  return (
    emailRegex.test(obj.email) &&
    requiredKeys.every((key) => keys.includes(key))
  );
}
