import { returnAuthError } from '@/app/utilities/auth/responses';
import { resendSignUpCode, ResendSignUpCodeInput } from 'aws-amplify/auth';
import '@/app/utilities/amplify/configure';

export async function POST(request: Request) {
  try {
    const data: ResendSignUpCodeInput = await request.json();

    return new Response(JSON.stringify(await resendSignUpCode(data)));
  } catch (ex) {
    return returnAuthError(ex);
  }
}
