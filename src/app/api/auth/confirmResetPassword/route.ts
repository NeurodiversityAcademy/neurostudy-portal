import { returnAuthError } from '@/app/utilities/auth/responses';
import { confirmResetPassword, ConfirmResetPasswordInput } from 'aws-amplify/auth';
import '@/app/utilities/amplify/configure';

export async function POST(request: Request) {
  try {
    const data: ConfirmResetPasswordInput = await request.json();

    return new Response(JSON.stringify(await confirmResetPassword(data)));
  } catch (ex) {
    return returnAuthError(ex);
  }
}
