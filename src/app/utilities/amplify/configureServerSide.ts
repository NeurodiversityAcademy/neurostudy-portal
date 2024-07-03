import { cookies } from 'next/headers';

import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { getCurrentUser } from 'aws-amplify/auth/server';

import outputs from '@/app/aws-exports';

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export async function getCurrentUserServer() {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    return currentUser;
  } catch (error) {
    !(
      error instanceof Error && error.name === 'UserUnAuthenticatedException'
    ) && console.error(error);
  }
}
