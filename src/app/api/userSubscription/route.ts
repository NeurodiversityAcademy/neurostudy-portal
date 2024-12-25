import { returnBadResponse } from '@/app/utilities/responses';
import {
  UserSubscriptionHandbookType,
  UserSubscriptionType,
} from '@/app/interfaces/UserSubscriptionType';
import { registerCRMContact } from '@/app/utilities/register/registerCRMContact';
import { isValidUserSubscriptionData } from '@/app/utilities/validation/validateUserSubscriptionData';
import CRMCreateResponseInterface from '@/app/interfaces/CRMCreateResponseInterface';

export async function POST(request: Request) {
  const data: UserSubscriptionHandbookType = await request.json();
  const subscriptionData: UserSubscriptionType = (() => {
    const newData = { ...data };
    delete newData.getHandbook;
    return newData;
  })();

  if (isValidUserSubscriptionData(subscriptionData)) {
    const response: CRMCreateResponseInterface | boolean =
      await registerCRMContact(subscriptionData);

    if (data.getHandbook === true) {
      // NOTE
      // We send the document regardless of failure
      return new Response(JSON.stringify('Handbook processing in progress.'));
    }

    return new Response(JSON.stringify(response));
  }

  return returnBadResponse();
}
