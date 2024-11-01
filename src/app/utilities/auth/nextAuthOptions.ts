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
import CognitoProvider from 'next-auth/providers/cognito';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
  DEFAULT_SESSION_AGE_IN_SECONDS,
  FORM_STATE,
  INVALID_CREDENTIALS_MESSAGE,
} from './constants';
import { AuthOptions, getServerSession } from 'next-auth';
import {
  COGNITO_CONFIDENTIAL_CLIENT_ID,
  COGNITO_CONFIDENTIAL_CLIENT_SECRET,
  COGNITO_ISSUER,
} from '../amplify/constants';

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

const nextAuthOptions: AuthOptions = {
  providers: [
    CognitoProvider({
      clientId: COGNITO_CONFIDENTIAL_CLIENT_ID,
      clientSecret: COGNITO_CONFIDENTIAL_CLIENT_SECRET,
      issuer: COGNITO_ISSUER,
      checks: 'nonce',
    }),
    CredentialsProvider({
      credentials: {
        username: { type: 'text', label: 'Username' },
        password: { type: 'password', label: 'Password' },
        confirmationCode: { type: 'text', label: 'Confirmation Code' },
      },
      async authorize(credentials, req) {
        if (await getServerSession(nextAuthOptions)) {
          throw new Error('A user is already signed-in.');
        }

        if (!credentials) {
          throw new Error('No credentials found!');
        }

        const {
          username = '',
          password = '',
          confirmationCode = '',
        } = credentials;

        if (req.query?.method === 'confirmSignUp') {
          const confirmSignUpOutput = await confirmSignUp({
            username,
            confirmationCode,
          });
          const { signUpStep } = confirmSignUpOutput.nextStep;

          if (signUpStep === FORM_STATE.DONE) {
            return await applySignIn({ username, password });
          } else {
            throw new Error(JSON.stringify(confirmSignUpOutput));
          }
        } else {
          return await applySignIn({ username, password });
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  session: {
    maxAge: DEFAULT_SESSION_AGE_IN_SECONDS,
  },
  jwt: {
    maxAge: DEFAULT_SESSION_AGE_IN_SECONDS,
  },
  callbacks: {
    async jwt(props) {
      const { token, user } = props;
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  events: {
    signIn: () => {
      signOut().catch(() => void 0);
    },
  },
};

export default nextAuthOptions;
