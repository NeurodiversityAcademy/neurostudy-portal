import { returnAuthError } from '@/app/utilities/auth/responses';
import { signUp, SignUpInput } from 'aws-amplify/auth';
import '@/app/utilities/amplify/configure';
import createUser from '@/app/utilities/auth/createUser';

export async function POST(request: Request) {
  try {
    const data: SignUpInput = await request.json();
    const { username: email, options } = data;
    // NOTE
    // We will manually sign-in regardless of `autoSignIn`,
    // so wouldn't want providing `autoSignIn: true` messing
    // with our operation
    if (options?.autoSignIn) {
      options.autoSignIn = false;
    }

    const { given_name, family_name, birthdate } =
      options?.userAttributes || {};

    const res = await signUp(data);
    await createUser(email, given_name, family_name, birthdate);

    return new Response(JSON.stringify(res));
  } catch (ex) {
    return returnAuthError(ex);
  }
}
