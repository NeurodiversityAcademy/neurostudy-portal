import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
  AuthError,
  confirmSignUp,
  getCurrentUser,
  GetCurrentUserOutput,
  resendSignUpCode,
  signIn,
  SignInOutput,
  signOut,
} from 'aws-amplify/auth';
import {
  DEFAULT_SESSION_AGE_IN_SECONDS,
  FORM_STATE,
  INVALID_CREDENTIALS_MESSAGE,
} from '@/app/utilities/auth/constants';
import {
  COGNITO_CONFIDENTIAL_CLIENT_ID,
  COGNITO_CONFIDENTIAL_CLIENT_SECRET,
  COGNITO_ISSUER,
} from '@/app/utilities/amplify/constants';
import type { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email?: string | null;
  }

  interface Session {
    user: {
      id?: string;
      email?: string | null;
      given_name?: string;
      family_name?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    email?: string | null;
    given_name?: string;
    family_name?: string;
  }
}

const getUser = async () => {
  const user: GetCurrentUserOutput = await getCurrentUser();

  return {
    id: user.userId,
    email: user.signInDetails?.loginId,
  };
};

const applySignIn = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  let signInOutput: SignInOutput;
  try {
    signInOutput = await signIn({ username, password });
  } catch (ex) {
    const error = ex as AuthError;

    if (error.name === 'NotAuthorizedException') {
      error.message = INVALID_CREDENTIALS_MESSAGE;
    }

    throw error;
  }

  const { signInStep } = signInOutput.nextStep;

  let user = null;

  if (signInStep === FORM_STATE.DONE) {
    user = await getUser();
  } else {
    if (signInStep === FORM_STATE.CONFIRM_SIGN_UP) {
      await resendSignUpCode({ username });
    }
    throw new Error(JSON.stringify(signInOutput));
  }

  return user;
};

const getAuthMethod = (request: Request | undefined): string | null => {
  if (!request?.url) {
    return null;
  }

  try {
    return new URL(request.url).searchParams.get('method');
  } catch {
    return null;
  }
};

export const { handlers, auth, signIn: authSignIn, signOut: authSignOut } =
  NextAuth({
    providers: [
      CognitoProvider({
        clientId: COGNITO_CONFIDENTIAL_CLIENT_ID,
        clientSecret: COGNITO_CONFIDENTIAL_CLIENT_SECRET,
        issuer: COGNITO_ISSUER,
        checks: ['nonce'],
      }),
      CredentialsProvider({
        credentials: {
          username: { type: 'text', label: 'Username' },
          password: { type: 'password', label: 'Password' },
          confirmationCode: { type: 'text', label: 'Confirmation Code' },
        },
        async authorize(credentials, request) {
          if (!credentials) {
            throw new Error('No credentials found!');
          }

          const username =
            typeof credentials.username === 'string'
              ? credentials.username
              : '';
          const password =
            typeof credentials.password === 'string'
              ? credentials.password
              : '';
          const confirmationCode =
            typeof credentials.confirmationCode === 'string'
              ? credentials.confirmationCode
              : '';

          if (getAuthMethod(request) === 'confirmSignUp') {
            const confirmSignUpOutput = await confirmSignUp({
              username,
              confirmationCode,
            });
            const { signUpStep } = confirmSignUpOutput.nextStep;

            if (signUpStep === FORM_STATE.DONE) {
              return await applySignIn({ username, password });
            }

            throw new Error(JSON.stringify(confirmSignUpOutput));
          }

          return await applySignIn({ username, password });
        },
      }),
    ],
    pages: {
      signIn: '/login',
      newUser: '/signup',
    },
    session: {
      strategy: 'jwt',
      maxAge: DEFAULT_SESSION_AGE_IN_SECONDS,
    },
    jwt: {
      maxAge: DEFAULT_SESSION_AGE_IN_SECONDS,
    },
    callbacks: {
      async jwt({ token, user, profile }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
        }

        if (profile) {
          if ('given_name' in profile && typeof profile.given_name === 'string') {
            token.given_name = profile.given_name;
          }
          if (
            'family_name' in profile &&
            typeof profile.family_name === 'string'
          ) {
            token.family_name = profile.family_name;
          }
        }
        return token as JWT;
      },
      async session({ session, token }) {
        if (session.user) {
          if (token.id) {
            session.user.id = token.id;
          }
          if (token.email) {
            session.user.email = token.email;
          }
          session.user.given_name = token.given_name;
          session.user.family_name = token.family_name;
        }
        return session;
      },
    },
    events: {
      signIn: () => {
        signOut().catch(() => undefined);
      },
    },
    trustHost: true,
  });
