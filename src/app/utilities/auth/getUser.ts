import { UserProps, UserWithEmailProps } from '@/app/interfaces/User';
import {
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { USER_TABLE_NAME, USER_TABLE_PARTITION_ID } from './constants';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { dbDocumentClient } from '../db/configure';

export default async function getUser(
  email: string
): Promise<UserWithEmailProps | undefined> {
  const commandParams: GetItemCommandInput = {
    TableName: USER_TABLE_NAME,
    Key: marshall({
      [USER_TABLE_PARTITION_ID]: email,
    }),
  };

  const command = new GetItemCommand(commandParams);
  const res: GetItemCommandOutput = await dbDocumentClient.send(command);

  const { Item } = res;
  const rawUser: UserProps | undefined = Item ? unmarshall(Item) : Item;
  const data: UserWithEmailProps | undefined = rawUser
    ? { ...rawUser, [USER_TABLE_PARTITION_ID]: email }
    : rawUser;

  return data;
}
