import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import {
  DEFAULT_USER,
  USER_TABLE_NAME,
  USER_TABLE_PARTITION_ID,
} from './constants';
import { marshall } from '@aws-sdk/util-dynamodb';
import { dbDocumentClient } from '../db/configure';
import {
  PrimaryUserAttributes,
  SecondaryUserAttributes,
  UserWithEmailProps,
} from '@/app/interfaces/User';

const createUser = async (
  { email, family_name, given_name }: PrimaryUserAttributes,
  { birthdate, subscribed }: SecondaryUserAttributes = {}
): Promise<UserWithEmailProps> => {
  const defaultUser: Partial<UserWithEmailProps> = { ...DEFAULT_USER };
  let key: keyof UserWithEmailProps;
  for (key in defaultUser) {
    const value = defaultUser[key];
    if (typeof value === 'number' || typeof value === 'boolean') {
      delete defaultUser[key];
    } else if (Array.isArray(value)) {
      while (value.pop()) {
        void 0;
      }
    }
  }

  const user: UserWithEmailProps = {
    ...defaultUser,
    [USER_TABLE_PARTITION_ID]: email,
    FirstName: given_name,
    LastName: family_name,
    DOB: birthdate,
    Subscribed: subscribed,
  };

  for (key in user) {
    const value: unknown = user[key];
    if (value === undefined) {
      delete user[key];
    }
  }

  const commandParams: PutItemCommandInput = {
    TableName: USER_TABLE_NAME,
    Item: marshall(user),
  };

  const command = new PutItemCommand(commandParams);
  await dbDocumentClient.send(command);

  return user;
};

export default createUser;
