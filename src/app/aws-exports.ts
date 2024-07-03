import { ResourcesConfig } from 'aws-amplify';

const NEXT_PUBLIC_USER_POOL_ID = process.env.NEXT_PUBLIC_USER_POOL_ID;
const NEXT_PUBLIC_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

if (!NEXT_PUBLIC_USER_POOL_ID || !NEXT_PUBLIC_CLIENT_ID) {
  throw new Error('Cognito variables have not been properly initialized.');
}

const awsconfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: NEXT_PUBLIC_USER_POOL_ID,
      userPoolClientId: NEXT_PUBLIC_CLIENT_ID,
    },
  },
};

export default awsconfig;
