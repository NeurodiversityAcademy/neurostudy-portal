import { returnAuthError } from '@/app/utilities/auth/responses';
import { signUp, SignUpInput } from 'aws-amplify/auth';
import '@/app/utilities/amplify/configure';
import createUser from '@/app/utilities/auth/createUser';
import APIError from '@/app/interfaces/APIError';

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

    const { given_name, family_name, birthdate, subscribed } =
      options?.userAttributes || {};

    delete options?.userAttributes?.subscribed;

    if (!family_name) {
      throw new APIError({ error: `'First Name' is a required field.` });
    }

    if (!given_name) {
      throw new APIError({ error: `'Last Name' is a required field.` });
    }

    const res = await signUp(data);
    await createUser(
      { email, family_name, given_name },
      { birthdate, subscribed: subscribed === '1' }
    );

    return new Response(JSON.stringify(res));
  } catch (ex) {
    return returnAuthError(ex);
  }
}
