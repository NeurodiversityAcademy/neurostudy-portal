import {
  UpdateItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { USER_TABLE_NAME, USER_TABLE_PARTITION_ID } from './constants';
import { marshall } from '@aws-sdk/util-dynamodb';
import { UserProps, UserToken } from '@/app/interfaces/User';
import { dbDocumentClient } from '../db/configure';

const updateUser = async (Item: UserProps, user: UserToken): Promise<UpdateItemCommandOutput> => {
  let updateExpression = 'set';
  const expressionAttributeValues: Record<string, unknown> = {};
  const expressionAttributeNames: Record<string, string> = {};

  for (const [attribute, value] of Object.entries(Item)) {
    updateExpression += ` #${attribute} = :${attribute},`;
    expressionAttributeValues[':' + attribute] = value;
    expressionAttributeNames['#' + attribute] = attribute;
  }

  updateExpression = updateExpression.slice(0, -1);

  const commandParams: UpdateItemCommandInput = {
    TableName: USER_TABLE_NAME,
    Key: marshall({
      [USER_TABLE_PARTITION_ID]: user.email,
    }),
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: marshall(expressionAttributeValues),
    ExpressionAttributeNames: expressionAttributeNames,
  };

  const command = new UpdateItemCommand(commandParams);
  const res = await dbDocumentClient.send(command);

  return res;
};

export default updateUser;
