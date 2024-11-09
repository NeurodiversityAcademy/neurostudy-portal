import { returnAuthError } from '@/app/utilities/auth/responses';
import { signUp, SignUpInput } from 'aws-amplify/auth';
import '@/app/utilities/amplify/configure';
import createUser from '@/app/utilities/auth/createUser';

export async function POST(request: Request) {
  try {
    const data: SignUpInput = await request.json();
    const { username: email } = data;
    // NOTE
    // We will manually sign-in regardless of `autoSignIn`,
    // so wouldn't want providing `autoSignIn: true` messing
    // with our operation
    if (data.options?.autoSignIn) {
      data.options.autoSignIn = false;
    }

    const res = await signUp(data);
    await createUser(email);

    return new Response(JSON.stringify(res));
  } catch (ex) {
    return returnAuthError(ex);
  }
}
